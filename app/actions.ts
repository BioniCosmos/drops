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
  if (!user) {
    throw new Error('Unauthorized')
  }
  const slug = nanoid()
  await prisma.codePaste.create({
    data: {
      title: title || 'Untitled Paste',
      content,
      language,
      authorId: user.id,
      isPublic,
      slug,
    },
  })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${slug}`)
}

export async function updatePaste(
  slug: string,
  title: string,
  content: string,
  language: string,
  isPublic: boolean,
) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({ where: { slug } })
  if (!paste || paste.authorId !== user.id) {
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

export async function deletePaste(slug: string) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({ where: { slug } })
  if (!paste || paste.authorId !== user.id) {
    throw new Error('Forbidden')
  }
  await prisma.codePaste.delete({ where: { slug } })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}
