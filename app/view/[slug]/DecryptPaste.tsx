'use client'

import { CodePreviewClient } from '@/components/CodePreview'
import { useSecret } from '@/hooks'
import { decrypt } from '@/lib/encryption'
import { useRef, useState } from 'react'

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
  let count = 0
  const decrypted = useRef(false)
  return (
    <div
      onClick={() => {
        count++
        if (count === 10) {
          try {
            if (!decrypted.current) {
              const key = prompt()
              setContent(decrypt(content, key ?? ''))
              decrypted.current = true
            } else {
              setContent(initialContent)
              decrypted.current = false
            }
          } catch (e) {
          } finally {
            count = 0
          }
        }
      }}
    >
      <CodePreviewClient content={content} language={language} />
    </div>
  )
}
