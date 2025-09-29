'use client'

import { uploadToDufs } from '@/app/actions'
import { UploadIcon } from 'lucide-react'
import { useTransition } from 'react'

export default function Upload({ slug }: { slug: string }) {
  const [isUploading, startUpload] = useTransition()

  const handleUpload = () => {
    const url = prompt('URL:')
    if (!url) {
      return
    }
    const username = prompt('Username:')
    if (!username) {
      return
    }
    const password = prompt('Password:')
    if (!password) {
      return
    }
    startUpload(async () => {
      await uploadToDufs(slug, url, username, password)
      alert('Success.')
    })
  }

  return (
    <button
      onClick={handleUpload}
      disabled={isUploading}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <UploadIcon size={16} />
      {isUploading ? 'Uploading…' : 'Upload'}
    </button>
  )
}
