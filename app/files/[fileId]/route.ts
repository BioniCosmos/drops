import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/files/[fileId]'>,
) {
  const { fileId } = await ctx.params

  const file = await prisma.pasteFile.findUnique({
    where: { id: fileId },
    include: { paste: { select: { isPublic: true, authorId: true } } },
  })

  if (!file) {
    return new Response('File not found', { status: 404 })
  }

  // TODO: anonymous paste
  if (!file.paste.isPublic) {
    const { user } = await getCurrentSession()
    if (file.paste.authorId !== user?.id) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  // TODO: check type details
  return new Response(Buffer.from(file.content), {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        file.filename,
      )}"`,
      'Content-Length': file.size.toString(),
    },
  })
}
