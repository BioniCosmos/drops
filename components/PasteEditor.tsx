'use client'

import { useTheme } from '@/hooks'
import { encrypt } from '@/lib/encryption'
import { lang, loadCodeMirrorLang } from '@/lib/lang'
import CodeMirror from '@uiw/react-codemirror'
import { FormEventHandler, useState, useTransition } from 'react'

export interface PasteEditorProps {
  initialTitle?: string
  initialContent?: string
  initialLanguage?: string
  initialIsPublic?: boolean
  action: (
    title: string,
    content: string,
    language: string,
    isPublic: boolean,
  ) => Promise<void>
  submitButtonText?: string
}

export default function PasteEditor({
  initialTitle = '',
  initialContent = '',
  initialLanguage = 'plaintext',
  initialIsPublic = true,
  action,
  submitButtonText = 'Save',
}: PasteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [language, setLanguage] = useState(initialLanguage)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [pending, startTransition] = useTransition()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const contentToSubmit = encryptionKey
      ? encrypt(content, encryptionKey)
      : content
    startTransition(() => action(title, contentToSubmit, language, isPublic))
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
