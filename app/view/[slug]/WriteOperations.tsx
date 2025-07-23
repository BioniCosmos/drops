'use client'

import { claimPaste, deletePaste, verifyAnonymousPaste } from '@/app/actions'
import DeleteButton from '@/components/DeleteButton'
import { CodePaste, User } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Props {
  paste: Omit<CodePaste, 'anonymousKey'>
  user: User | null
}

export default function WriteOperations({ paste, user }: Props) {
  const anonymousKey = useRef('')
  const [authorizedAnonymous, setAuthorizedAnonymous] = useState(false)
  const owned = user?.id === paste.authorId
  const authorized = authorizedAnonymous || owned
  const isAnonymous = paste.authorId === null
  const showClaimButton = !!user && isAnonymous && authorizedAnonymous
  const localStorageKey = `drop-${paste.slug}`

  useEffect(() => {
    anonymousKey.current = localStorage.getItem(localStorageKey) ?? ''
    if (isAnonymous) {
      verifyAnonymousPaste(paste.id, anonymousKey.current).then(setAuthorizedAnonymous)
    }
  }, [localStorageKey, isAnonymous, paste.id])

  async function handleClaim() {
    try {
      await claimPaste(paste.id, anonymousKey.current)
      localStorage.removeItem(localStorageKey)
      alert('Paste claimed successfully!')
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to claim paste: ${error.message}`)
      }
    }
  }

  return (
    authorized && (
      <>
        <Link
          href={`/edit/${paste.slug}`}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit
        </Link>
        <DeleteButton
          action={deletePaste.bind(null, paste.id, anonymousKey.current)}
          className="px-4 py-2 text-sm rounded-lg"
        />
        {showClaimButton && (
          <button
            onClick={handleClaim}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Claim
          </button>
        )}
      </>
    )
  )
}
