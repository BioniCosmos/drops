'use client'

import type { XFile } from '@/components/FileManager'
import PasteEditor from '@/components/PasteEditor'
import { redirect } from 'next/navigation'
import { createPaste as createPasteAction } from './actions'

export default function CreatePaste() {
  async function createPaste(
    title: string,
    content: string,
    language: string,
    isPublic: boolean,
    files: XFile[],
  ) {
    const { type, slug, anonymousKey } = await createPasteAction(
      title,
      content,
      language,
      isPublic,
      files,
    )
    if (type === 'anonymous') {
      localStorage.setItem(`drop-${slug}`, anonymousKey)
    }
    redirect(`/view/${slug}`)
  }

  return <PasteEditor action={createPaste} submitButtonText="Create Paste" />
}
