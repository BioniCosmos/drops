'use client'

import { downloadFromDufs } from '@/app/actions'
import { DownloadIcon } from 'lucide-react'
import { useEffect, useRef, useTransition } from 'react'

export default function Download({ slug }: { slug: string }) {
  const [isDownloading, startDownload] = useTransition()
  const anonymousKey = useRef('')
  const localStorageKey = `drop-${slug}`

  useEffect(() => {
    anonymousKey.current = localStorage.getItem(localStorageKey) ?? ''
  }, [localStorageKey])

  const handleDownload = () => {
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

    startDownload(async () => {
      await downloadFromDufs(
        slug,
        anonymousKey.current,
        url,
        username,
        password,
      )
      alert('Success.')
    })
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <DownloadIcon size={16} />
      {isDownloading ? 'Downloading…' : 'Download'}
    </button>
  )
}
