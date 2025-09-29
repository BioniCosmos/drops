import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { notFound } from 'next/navigation'
import EditPaste from './EditPaste'

export default async function PastePage({ params }: PageProps<'/edit/[slug]'>) {
  const { slug } = await params
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    include: {
      files: {
        select: {
          id: true,
          filename: true,
          mimeType: true,
          size: true,
        },
      },
    },
    omit: { anonymousKey: true },
  })
  if (!paste) {
    notFound()
  }
  const { user } = await getCurrentSession()
  return <EditPaste paste={paste} user={user} />
}
