'use client'

import { exportPaste } from '@/app/actions'
import { getSupportedExtensions } from '@/lib/lang'
import { ChangeEventHandler, useTransition } from 'react'

interface ExportImportProps {
  slug?: string
  onImport?: (title: string, content: string, extension: string) => void
}

export default function ExportImport({ slug, onImport }: ExportImportProps) {
  const [isExporting, startExport] = useTransition()
  const [isImporting, startImport] = useTransition()

  const supportedExtensions = getSupportedExtensions().join(',')

  function handleExport() {
    startExport(async () => {
      const [file, name] = await exportPaste(slug!)
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

  const handleImport: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) {
      return
    }
    startImport(async () => {
      onImport!(file.name, await file.text(), file.name.split('.')[1])
      e.target.value = ''
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slug && (
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
      )}
      {onImport && (
        <div className="relative">
          <input
            type="file"
            accept={supportedExtensions}
            onChange={handleImport}
            disabled={isImporting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className={`inline-block px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors ${
              isImporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </label>
        </div>
      )}
    </div>
  )
}
