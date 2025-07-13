'use client'

import { updatePaste, verifyAnonymousPaste } from '@/app/actions'
import PasteEditor from '@/components/PasteEditor'
import { CodePaste, User } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'

interface Props {
  paste: Omit<CodePaste, 'anonymousKey'>
  user: User | null
}

export default function EditPaste({ paste, user }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [anonymousKey, setAnonymousKey] = useState('')

  useEffect(() => {
    startTransition(async () => {
      setAnonymousKey(localStorage.getItem(`drop-${paste.slug}`) ?? '')
      if (
        user?.id === paste.authorId ||
        (await verifyAnonymousPaste(paste.slug, anonymousKey))
      ) {
        setIsAuthorized(true)
      }
    })
  }, [anonymousKey, paste.authorId, paste.slug, user?.id])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-700 dark:text-gray-200">Loading…</div>
      </div>
    )
  }
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-700 dark:text-gray-200">Unauthorized</div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          action={updatePaste.bind(null, paste.slug, anonymousKey)}
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
