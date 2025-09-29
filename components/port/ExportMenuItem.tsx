'use client'

import { FileDown } from 'lucide-react'
import { useExport } from './hooks'

interface ExportImportMenuProps {
  slug: string
}

export function ExportMenuItem({ slug }: ExportImportMenuProps) {
  const { handleExport, isExporting } = useExport(slug)
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
    >
      <FileDown size={16} />
      {isExporting ? 'Exporting…' : 'Export'}
    </button>
  )
}
