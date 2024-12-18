'use client'

import { MouseEventHandler, useTransition } from 'react'

export interface DeleteButtonProps {
  action: () => Promise<void>
}

export default function DeleteButton({ action }: DeleteButtonProps) {
  const [pending, startTransition] = useTransition()
  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    if (
      confirm(
        'Are you sure you want to delete this paste? This action cannot be undone.',
      )
    ) {
      startTransition(action)
    }
  }

  return (
    <button
      disabled={pending}
      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDelete}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
