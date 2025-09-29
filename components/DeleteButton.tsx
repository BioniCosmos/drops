'use client'

import { clsx } from 'clsx'
import { Trash2 } from 'lucide-react'
import { MouseEventHandler, useTransition } from 'react'

export interface DeleteButtonProps {
  action: () => Promise<void>
  className?: string
}

export default function DeleteButton({ action, className }: DeleteButtonProps) {
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
      className={clsx(
        'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2',
        className,
      )}
      onClick={handleDelete}
    >
      <Trash2 size={16} />
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
