'use client'

import { cn } from '@/lib/utils'
import { useImport } from './hooks'

interface ImportButtonProps {
  onImport: (title: string, content: string, extension: string) => void
}

export function ImportButton({ onImport }: ImportButtonProps) {
  const { handleImport, isImporting, supportedExtensions } = useImport(onImport)
  return (
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
        className={cn(
          'inline-block px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors',
          { 'opacity-50 cursor-not-allowed': isImporting },
        )}
      >
        {isImporting ? 'Importing…' : 'Import'}
      </label>
    </div>
  )
}
