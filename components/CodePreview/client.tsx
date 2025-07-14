'use client'

import { loadShikiLang } from '@/lib/lang'
import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { CodePreviewProps, getContentPreview } from './common'

export function CodePreviewClient({
  content,
  language,
  preview = false,
  maxLines = 10,
}: CodePreviewProps) {
  const displayContent = preview
    ? getContentPreview(content, maxLines)
    : content
  const [html, setHtml] = useState('')
  useEffect(() => {
    codeToHtml(displayContent, {
      lang: loadShikiLang(language),
      themes: { light: 'github-light', dark: 'github-dark' },
    }).then(setHtml)
  }, [displayContent, language])
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
