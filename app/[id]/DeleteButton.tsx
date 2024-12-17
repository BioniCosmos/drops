'use client'

import { FormEventHandler } from 'react'
import { useFormStatus } from 'react-dom'

export interface DeleteButtonProps {
  action: () => Promise<void>
}

export default function DeleteButton({ action }: DeleteButtonProps) {
  const handleDelete: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (
      confirm(
        'Are you sure you want to delete this paste? This action cannot be undone.',
      )
    ) {
      await action()
    }
  }

  return (
    <form onSubmit={handleDelete}>
      <Delete />
    </form>
  )
}

function Delete() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
