'use client'

import { CodePreviewClient } from '@/components/CodePreview'
import { useSecret } from '@/hooks'
import { decrypt } from '@/lib/encryption'
import { useState } from 'react'

export default function DecryptPaste({
  initialContent,
  language,
}: {
  initialContent: string
  language: string
}) {
  const [content, setContent] = useState(initialContent)
  useSecret(
    (key) => setContent(decrypt(content, key)),
    () => setContent(initialContent),
  )
  return <CodePreviewClient content={content} language={language} />
}
