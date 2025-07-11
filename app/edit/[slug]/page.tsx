import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { notFound } from 'next/navigation'
import EditPaste from './EditPaste'

export interface PastePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return prisma.codePaste.findMany()
}

export default async function PastePage({ params }: PastePageProps) {
  const { slug } = await params
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    omit: { anonymousKey: true },
  })
  if (!paste) {
    notFound()
  }
  const { user } = await getCurrentSession()
  return <EditPaste paste={paste} user={user} />
}
