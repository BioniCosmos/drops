'use client'

import { deletePaste, verifyAnonymousPaste } from '@/app/actions'
import DeleteButton from '@/components/DeleteButton'
import { User } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  slug: string
  user: User | null
}

export default function WriteOperations({ slug, user }: Props) {
  const [isValidAnonymousPaste, setIsValidAnonymousPaste] = useState(false)
  const [anonymousKey, setAnonymousKey] = useState('')

  useEffect(() => {
    setAnonymousKey(localStorage.getItem(`drop-${slug}`) ?? '')
    if (anonymousKey) {
      verifyAnonymousPaste(slug, anonymousKey).then(setIsValidAnonymousPaste)
    }
  }, [slug, anonymousKey])

  if (!user && !isValidAnonymousPaste) {
    return null
  }
  return (
    <>
      <Link
        href={`/edit/${slug}`}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Edit
      </Link>
      <DeleteButton
        action={deletePaste.bind(null, slug, anonymousKey)}
        className="px-4 py-2 text-sm rounded-lg"
      />
    </>
  )
}
