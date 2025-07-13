'use client'

import { deletePaste, verifyAnonymousPaste } from '@/app/actions'
import DeleteButton from '@/components/DeleteButton'
import { CodePaste, User } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  paste: Omit<CodePaste, 'anonymousKey'>
  user: User | null
}

export default function WriteOperations({ paste, user }: Props) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [anonymousKey, setAnonymousKey] = useState('')

  useEffect(() => {
    ;(async () => {
      setAnonymousKey(localStorage.getItem(`drop-${paste.slug}`) ?? '')
      if (
        user?.id === paste.authorId ||
        (await verifyAnonymousPaste(paste.slug, anonymousKey))
      ) {
        setIsAuthorized(true)
      }
    })()
  }, [anonymousKey, paste.authorId, paste.slug, user?.id])

  return (
    isAuthorized && (
      <>
        <Link
          href={`/edit/${paste.slug}`}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit
        </Link>
        <DeleteButton
          action={deletePaste.bind(null, paste.slug, anonymousKey)}
          className="px-4 py-2 text-sm rounded-lg"
        />
      </>
    )
  )
}
