import { loadShikiLang } from '@/lib/lang'
import { codeToHtml } from 'shiki'

export interface CodePreviewProps {
  content: string
  language: string
  preview?: boolean
  maxLines?: number
}

export default async function CodePreview({
  content,
  language,
  preview = false,
  maxLines = 10,
}: CodePreviewProps) {
  const displayContent = preview
    ? getContentPreview(content, maxLines)
    : content
  const __html = await codeToHtml(displayContent, {
    lang: loadShikiLang(language),
    themes: { light: 'github-light', dark: 'github-dark' },
  })
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg"
      dangerouslySetInnerHTML={{ __html }}
    />
  )
}

function getContentPreview(content: string, maxLines: number = 10): string {
  const lines = content.split('\n')
  if (lines.length <= maxLines) {
    return content
  }
  return lines.slice(0, maxLines).join('\n')
}
