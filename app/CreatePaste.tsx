'use client'

import PasteEditor from '@/components/PasteEditor'
import { redirect } from 'next/navigation'
import { createPaste as createPasteAction } from './actions'

export default function CreatePaste() {
  async function createPaste(
    title: string,
    content: string,
    language: string,
    isPublic: boolean,
  ) {
    const { type, slug, anonymousKey } = await createPasteAction(
      title,
      content,
      language,
      isPublic,
    )
    if (type === 'anonymous') {
      localStorage.setItem(`drop-${slug}`, anonymousKey)
    }
    redirect(`/view/${slug}`)
  }

  return <PasteEditor action={createPaste} submitButtonText="Create Paste" />
}
