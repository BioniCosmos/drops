'use client'

import { updatePaste, verifyAnonymousPaste } from '@/app/actions'
import PasteEditor from '@/components/PasteEditor'
import { CodePaste, User } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'

interface Props {
  paste: Omit<CodePaste, 'anonymousKey'>
  user: User | null
}

export default function EditPaste({ paste, user }: Props) {
  const [isPending, startTransition] = useTransition()
  const anonymousKey = useRef('')
  const [isAuthorizedAnonymous, setIsAuthorizedAnonymous] = useState(false)
  const isAuthorized = user?.id === paste.authorId || isAuthorizedAnonymous
  const isAnonymous = paste.authorId === null

  useEffect(() => {
    startTransition(async () => {
      anonymousKey.current = localStorage.getItem(`drop-${paste.slug}`) ?? ''
      if (isAnonymous) {
        await verifyAnonymousPaste(paste.id, anonymousKey.current).then(setIsAuthorizedAnonymous)
      }
    })
  }, [paste.slug, isAnonymous, paste.id])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-700 dark:text-gray-200">Loading…</div>
      </div>
    )
  }
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 h-full">
        <div className="text-gray-700 dark:text-gray-200">Unauthorized</div>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Paste
            </h1>
            <Link
              href={`/view/${paste.slug}`}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
        <PasteEditor
          action={updatePaste.bind(null, paste.id, anonymousKey.current)}
          initialTitle={paste.title}
          initialContent={paste.content}
          initialLanguage={paste.language}
          initialIsPublic={paste.isPublic}
          submitButtonText="Update Paste"
        />
      </main>
    </div>
  )
}
