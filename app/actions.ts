'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPaste(
  title: string,
  content: string,
  language: string,
) {
  const { id } = await prisma.codePaste.create({
    data: { title: title || 'Untitled Paste', content, language },
  })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  redirect(`/view/${id}`)
}

export async function updatePaste(
  id: number,
  title: string,
  content: string,
  language: string,
) {
  await prisma.codePaste.update({
    where: { id },
    data: { title: title || 'Untitled Paste', content, language },
  })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  redirect(`/view/${id}`)
}

export async function deletePaste(id: number) {
  await prisma.codePaste.delete({ where: { id } })
  revalidatePath(`/view/${id}`)
  revalidatePath(`/edit/${id}`)
  revalidatePath('/list')
  redirect('/list')
}
