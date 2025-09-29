'use client'

import { claimPaste, deletePaste, verifyAnonymousPaste } from '@/app/actions'
import DeleteButton from '@/components/DeleteButton'
import { CodePaste, User } from '@prisma/client'
import { Pen, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Download from './Download'

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
      verifyAnonymousPaste(paste.slug, anonymousKey.current).then(
        setAuthorizedAnonymous,
      )
    }
  }, [localStorageKey, isAnonymous, paste.slug])

  async function handleClaim() {
    try {
      await claimPaste(paste.slug, anonymousKey.current)
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
        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        <Download slug={paste.slug} />
        <Link
          href={`/edit/${paste.slug}`}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
        >
          <Pen size={16} />
          Edit
        </Link>
        <DeleteButton
          action={deletePaste.bind(null, paste.slug, anonymousKey.current)}
          className="w-full text-left px-4 py-2 text-sm rounded-none"
        />
        {showClaimButton && (
          <button
            onClick={handleClaim}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            <UserPlus size={16} />
            Claim
          </button>
        )}
      </>
    )
  )
}
