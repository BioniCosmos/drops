'use client'

import { useTheme } from '@/hooks'
import { encrypt } from '@/lib/encryption'
import { getLangFromExtension, lang, loadCodeMirrorLang } from '@/lib/lang'
import { Prisma } from '@prisma/client'
import dynamic from 'next/dynamic'
import { FormEventHandler, useState, useTransition } from 'react'
import { FileManager, useFiles, type XFile } from './FileManager'
import { ExportButton, ImportButton } from './port'

export interface PasteEditorProps {
  paste?: Prisma.CodePasteGetPayload<{
    select: {
      slug: true
      title: true
      content: true
      language: true
      isPublic: true
      files: {
        select: { id: true; filename: true; mimeType: true; size: true }
      }
    }
  }>
  action: (
    title: string,
    content: string,
    language: string,
    isPublic: boolean,
    newFiles: XFile[],
    filesToDel: string[],
  ) => Promise<void>
  submitButtonText?: string
}

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-[#282c34] h-[400px] text-[#888] font-[monospace] text-[13px]">
      <div className="pl-4 pt-2 flex items-center gap-1">
        <div>Loading editor…</div>
        <span className="animate-breathing h-4.5 w-px bg-blue-500" />
      </div>
    </div>
  ),
})

export default function PasteEditor({
  paste,
  action,
  submitButtonText = 'Save',
}: PasteEditorProps) {
  const [title, setTitle] = useState(paste?.title ?? '')
  const [content, setContent] = useState(paste?.content ?? '')
  const [language, setLanguage] = useState(paste?.language ?? 'plaintext')
  const [isPublic, setIsPublic] = useState(paste?.isPublic ?? true)
  const [encryptionKey, setEncryptionKey] = useState('')
  const { newFiles, filesToDel } = useFiles()
  const [pending, startTransition] = useTransition()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const contentToSubmit = encryptionKey
      ? encrypt(content, encryptionKey)
      : content
    startTransition(() =>
      action(title, contentToSubmit, language, isPublic, newFiles, filesToDel),
    )
  }

  function handleImport(title: string, content: string, extension: string) {
    setTitle(title)
    setContent(content)
    setLanguage(getLangFromExtension(extension))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6"
    >
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
      />
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
      >
        {Object.entries(lang).map(([value, { name }]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
      <div className="flex gap-4">
        <input
          id="encryptionKey"
          type="password"
          value={encryptionKey}
          onChange={(e) => setEncryptionKey(e.target.value)}
          placeholder="Enter key to encrypt (optional)"
          className="grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
        />
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <CodeMirror
          value={content}
          height="400px"
          theme={useTheme()}
          placeholder="Paste your code here"
          extensions={loadCodeMirrorLang(language)}
          onChange={(value) => setContent(value)}
          className="h-full"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Import/Export
        </h3>
        <div className="flex flex-wrap gap-2">
          <ImportButton onImport={handleImport} />
          {paste && <ExportButton slug={paste.slug} />}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          File Attachments
        </h3>
        <FileManager files={paste?.files} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.currentTarget.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label
            htmlFor="isPublic"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Publicly visible
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Submitting...' : submitButtonText}
        </button>
      </div>
    </form>
  )
}
