import { getLangExtension } from '@/lib/lang'
import prisma from '@/lib/server/db'
import mime from 'mime'
import { NextRequest } from 'next/server'

interface Context {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ download: string }>
}

export async function GET(_: NextRequest, { params, searchParams }: Context) {
  const { slug } = await params
  const { download } = await searchParams

  // TODO: private paste
  const paste = await prisma.codePaste.findUnique({
    where: { slug, isPublic: true },
    select: { content: true, title: true, language: true },
  })

  if (!paste) {
    return new Response('Paste not found', { status: 404 })
  }

  const extension = getLangExtension(paste.language)
  return new Response(paste.content, {
    headers: {
      'Content-Type': `${
        download ? mime.getType(extension) : 'text/plain'
      }; charset=utf-8`,
      ...(download && {
        'Content-Disposition': `attachment; filename="${paste.title}${extension}"`,
      }),
    },
  })
}
