'use client'

import { useExport } from './hooks'

interface ExportButtonProps {
  slug: string
}

export function ExportButton({ slug }: ExportButtonProps) {
  const { handleExport, isExporting } = useExport(slug)
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isExporting ? 'Exporting…' : 'Export'}
    </button>
  )
}
