'use client'

import { CodePreviewClient } from '@/components/CodePreview'
import { useSecret } from '@/hooks'
import { decrypt } from '@/lib/encryption'
import { useState } from 'react'

export default function DecryptPaste({
  initialContent,
  language,
  children,
}: {
  initialContent: string
  language: string
  children: React.ReactNode
}) {
  const [useClient, setUseClient] = useState(false)
  const [content, setContent] = useState(initialContent)
  const clickHandler = useSecret(
    (key) => {
      setContent(decrypt(content, key))
      setUseClient(true)
    },
    () => setContent(initialContent),
  )
  return (
    <div onClick={clickHandler}>
      {useClient ? (
        <CodePreviewClient content={content} language={language} />
      ) : (
        children
      )}
    </div>
  )
}
