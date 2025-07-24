'use server'

import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { day, hash } from '@/lib/utils'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createPaste(
  title: string,
  content: string,
  language: string,
  isPublic: boolean,
) {
  const { user } = await getCurrentSession()
  const anonymousKey = nanoid()
  const slug = nanoid()
  await prisma.codePaste.create({
    data: {
      title: title || 'Untitled Paste',
      content,
      language,
      authorId: user?.id,
      isPublic,
      slug,
      anonymousKey,
    },
  })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  return { type: user ? 'owned' : 'anonymous', slug, anonymousKey }
}

export async function updatePaste(
  id: number,
  anonymousKey: string,
  title: string,
  content: string,
  language: string,
  isPublic: boolean,
) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({
    where: { id },
    select: { id: true, slug: true, authorId: true, anonymousKey: true },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  if (paste.authorId !== user?.id && paste.anonymousKey !== anonymousKey) {
    throw Error('Forbidden')
  }
  await prisma.codePaste.update({
    where: { id: paste.id },
    data: { title: title || 'Untitled Paste', content, language, isPublic },
  })
  revalidatePath(`/view/${paste.slug}`)
  revalidatePath(`/edit/${paste.slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${paste.slug}`)
}

export async function deletePaste(id: number, anonymousKey: string) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({
    where: { id },
    select: { id: true, slug: true, authorId: true, anonymousKey: true },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  if (paste.authorId !== user?.id && paste.anonymousKey !== anonymousKey) {
    throw Error('Forbidden')
  }
  await prisma.codePaste.delete({ where: { id: paste.id } })
  revalidatePath(`/view/${paste.slug}`)
  revalidatePath(`/edit/${paste.slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}

export async function claimPaste(id: number, anonymousKey: string) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({
    where: { id },
    select: { id: true, slug: true, authorId: true, anonymousKey: true },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  if (paste.anonymousKey !== anonymousKey) {
    throw Error('Forbidden: Invalid anonymous key')
  }
  if (paste.authorId !== null) {
    throw Error('Paste is already owned')
  }
  await prisma.codePaste.update({
    where: { id: paste.id },
    data: { authorId: user.id, anonymousKey: '' },
  })
  revalidatePath(`/view/${paste.slug}`)
  revalidatePath(`/edit/${paste.slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}

export async function verifyAnonymousPaste(id: number, anonymousKey: string) {
  const paste = await prisma.codePaste.findUnique({
    where: { id },
    select: { anonymousKey: true },
  })
  return paste?.anonymousKey === anonymousKey
}

export async function trackPasteView(pasteId: number) {
  const { user } = await getCurrentSession()
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
    return null
  }

  const { slug, views, uniqueViews } = await prisma.$transaction(async (tx) => {
    await tx.pasteView.create({
      data: { pasteId, ipHash, uaHash, userId: user?.id },
    })
    const isFirstTimeVisitor = !(await prisma.pasteView.findFirst({
      where: { pasteId, ipHash, uaHash },
    }))
    return tx.codePaste.update({
      where: { id: pasteId },
      data: {
        views: { increment: 1 },
        ...(isFirstTimeVisitor && { uniqueViews: { increment: 1 } }),
      },
      select: { slug: true, views: true, uniqueViews: true },
    })
  })

  revalidatePath(`/view/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  return { views, uniqueViews }
}
