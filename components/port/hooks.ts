'use client'

import { exportPaste } from '@/app/actions'
import { getSupportedExtensions } from '@/lib/lang'
import { ChangeEventHandler, useTransition } from 'react'

export function useExport(slug: string) {
  const [isExporting, startExport] = useTransition()

  function handleExport() {
    startExport(async () => {
      const [file, name] = await exportPaste(slug)
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  return { handleExport, isExporting }
}

export function useImport(
  onImport: (title: string, content: string, extension: string) => void,
) {
  const [isImporting, startImport] = useTransition()
  const supportedExtensions = getSupportedExtensions().join(',')

  const handleImport: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) {
      return
    }
    startImport(async () => {
      onImport(file.name, await file.text(), file.name.split('.')[1])
      e.target.value = ''
    })
  }

  return { handleImport, isImporting, supportedExtensions }
}
