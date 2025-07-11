'use server'

import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
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
  slug: string,
  anonymousKey: string,
  title: string,
  content: string,
  language: string,
  isPublic: boolean,
) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({ where: { slug } })
  if (paste?.authorId !== user?.id && paste?.anonymousKey !== anonymousKey) {
    throw new Error('Forbidden')
  }
  await prisma.codePaste.update({
    where: { slug },
    data: { title: title || 'Untitled Paste', content, language, isPublic },
  })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${slug}`)
}

export async function deletePaste(slug: string, anonymousKey: string) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({ where: { slug } })
  if (paste?.authorId !== user?.id && paste?.anonymousKey !== anonymousKey) {
    throw new Error('Forbidden')
  }
  await prisma.codePaste.delete({ where: { slug } })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}

export async function verifyAnonymousPaste(slug: string, anonymousKey: string) {
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: { anonymousKey: true },
  })
  return paste?.anonymousKey === anonymousKey
}
