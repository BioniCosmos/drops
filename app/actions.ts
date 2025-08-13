'use server'

import type { XFile } from '@/components/FileManager'
import { getLangExtension } from '@/lib/lang'
import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { day, hash } from '@/lib/utils'
import JSZip from 'jszip'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createPaste(
  title: string,
  content: string,
  language: string,
  isPublic: boolean,
  files: XFile[],
) {
  const { user } = await getCurrentSession()
  const anonymousKey = nanoid()
  const slug = nanoid()
  const { id } = await prisma.codePaste.create({
    data: {
      title: title || 'Untitled Paste',
      content,
      language,
      authorId: user?.id,
      isPublic,
      slug,
      anonymousKey,
    },
    select: { id: true },
  })
  if (files.length > 0) {
    await uploadFiles(id, files)
  }
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
  newFiles: XFile[],
  filesToDel: string[],
) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: { id: true, authorId: true, anonymousKey: true },
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
  if (filesToDel.length > 0) {
    await prisma.pasteFile.deleteMany({
      where: { id: { in: filesToDel }, pasteId: paste.id },
    })
  }
  if (newFiles.length > 0) {
    await uploadFiles(paste.id, newFiles)
  }
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  redirect(`/view/${slug}`)
}

export async function deletePaste(slug: string, anonymousKey: string) {
  const { user } = await getCurrentSession()
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: { id: true, authorId: true, anonymousKey: true },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  if (paste.authorId !== user?.id && paste.anonymousKey !== anonymousKey) {
    throw Error('Forbidden')
  }
  await prisma.codePaste.delete({ where: { id: paste.id } })
  revalidatePath(`/view/${slug}`)
  revalidatePath(`/edit/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
}

export async function claimPaste(slug: string, anonymousKey: string) {
  const { user } = await getCurrentSession()
  if (!user) {
    throw Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: { id: true, authorId: true, anonymousKey: true },
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

export async function trackPasteView(slug: string) {
  const { user } = await getCurrentSession()
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? ''
  const userAgent = headersList.get('user-agent') ?? 'unknown'
  const ipHash = await hash(ip)
  const uaHash = await hash(userAgent)

  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  const pasteId = paste.id
  // check if the user has visited the paste in the last 24 hours
  const existingViewCount = await prisma.pasteView.count({
    where: {
      pasteId,
      ipHash,
      uaHash,
      viewedAt: { gte: new Date(Date.now() - day * 1000) },
    },
  })
  if (existingViewCount > 0) {
    return null
  }

  const { views, uniqueViews } = await prisma.$transaction(async (tx) => {
    const visitCount = await prisma.pasteView.count({
      where: { pasteId, ipHash, uaHash, userId: user?.id },
    })
    const isFirstTimeVisitor = visitCount === 0
    if (isFirstTimeVisitor) {
      await tx.pasteView.create({
        data: { pasteId, ipHash, uaHash, userId: user?.id },
      })
    }
    return tx.codePaste.update({
      where: { id: pasteId },
      data: {
        views: { increment: 1 },
        ...(isFirstTimeVisitor && { uniqueViews: { increment: 1 } }),
      },
      select: { views: true, uniqueViews: true },
    })
  })

  revalidatePath(`/view/${slug}`)
  revalidatePath('/list')
  revalidatePath('/admin')
  return { views, uniqueViews }
}

async function uploadFiles(pasteId: number, files: XFile[]) {
  const maxSize = 10 * 1024 * 1024
  for (const file of files) {
    if (file.size > maxSize) {
      throw Error(`File ${file.filename} exceeds 10 MB limit`)
    }
  }
  const contents = await Promise.all(files.map((file) => file.file.bytes()))
  await prisma.pasteFile.createMany({
    data: files.map((file, i) => ({
      id: file.id,
      pasteId,
      filename: file.filename,
      content: contents[i],
      mimeType: file.mimeType,
      size: file.size,
    })),
  })
}

export async function exportPaste(slug: string): Promise<[Blob, string]> {
  const { user } = await getCurrentSession()
  if (!user) {
    throw Error('Unauthorized')
  }
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    select: {
      title: true,
      content: true,
      language: true,
      files: { select: { filename: true, content: true } },
    },
  })
  if (!paste) {
    throw Error('Paste not found')
  }
  const zip = new JSZip()
  const pasteFolder = zip.folder(paste.title)!
  pasteFolder.file(
    `${paste.title}${getLangExtension(paste.language)}`,
    paste.content,
  )
  if (paste.files.length > 0) {
    const attachmentsFolder = pasteFolder.folder('attachments')!
    paste.files.forEach((file) =>
      attachmentsFolder.file(file.filename, file.content),
    )
  }
  return [await zip.generateAsync({ type: 'blob' }), `${paste.title}.zip`]
}
