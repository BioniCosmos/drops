'use server'

import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPaste(
  title: string,
  content: string,
  language: string,
) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { id } = await prisma.codePaste.create({
    data: {
      title: title || 'Untitled Paste',
      content,
      language,
      authorId: user.id,
      isPublic: true,
    },
  })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${id}`)
}

export async function updatePaste(
  id: number,
  title: string,
  content: string,
  language: string,
) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({ where: { id } })
  if (!paste || paste.authorId !== user.id) {
    throw new Error('Forbidden')
  }
  await prisma.codePaste.update({
    where: { id },
    data: { title: title || 'Untitled Paste', content, language },
  })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${id}`)
}

export async function deletePaste(id: number) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({ where: { id } })
  if (!paste || paste.authorId !== user.id) {
    throw new Error('Forbidden')
  }
  await prisma.codePaste.delete({ where: { id } })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}
