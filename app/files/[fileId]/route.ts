import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { NextRequest } from 'next/server'

interface Context {
  params: Promise<{ fileId: string }>
}

export async function GET(_: NextRequest, { params }: Context) {
  const { fileId } = await params

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

  return new Response(file.content, {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        file.filename,
      )}"`,
      'Content-Length': file.size.toString(),
    },
  })
}
