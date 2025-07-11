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
  const [anonymousKey, setAnonymousKey] = useState('')
  const [isValidAnonymousPaste, setIsValidAnonymousPaste] = useState(true)

  useEffect(() => {
    startTransition(async () => {
      if (user && user.id === paste.authorId) {
        return
      }
      setAnonymousKey(localStorage.getItem(`drop-${paste.slug}`) ?? '')
      if (
        anonymousKey &&
        (await verifyAnonymousPaste(paste.slug, anonymousKey))
      ) {
        return
      }
      setIsValidAnonymousPaste(false)
    })
  }, [user, paste, anonymousKey])

  if (!isValidAnonymousPaste) {
    return <div>Unauthorized</div>
  }
  return (
    !isPending && (
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
  )
}
