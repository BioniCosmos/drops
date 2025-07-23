import { day, hash } from '@/lib/utils'
import { headers } from 'next/headers'
import prisma from './db'

export async function trackPasteView(pasteId: number, userId?: number) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? ''
  const userAgent = headersList.get('user-agent') ?? 'unknown'
  const ipHash = await hash(ip)
  const uaHash = await hash(userAgent)
  // check if the user has visited the paste in the last 24 hours
  const existingView = await prisma.pasteView.findFirst({
    where: {
      pasteId,
      ipHash,
      uaHash,
      viewedAt: { gte: new Date(Date.now() - day * 1000) },
    },
  })
  if (existingView) {
    return
  }
  await prisma.$transaction(async (tx) => {
    await tx.pasteView.create({ data: { pasteId, ipHash, uaHash, userId } })
    const isFirstTimeVisitor = !(await prisma.pasteView.findFirst({
      where: { pasteId, ipHash, uaHash },
    }))
    await tx.codePaste.update({
      where: { id: pasteId },
      data: {
        views: { increment: 1 },
        ...(isFirstTimeVisitor && { uniqueViews: { increment: 1 } }),
      },
    })
  })
}
