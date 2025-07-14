import { loadShikiLang } from '@/lib/lang'
import { codeToHtml } from 'shiki'
import { CodePreviewProps, getContentPreview } from './common'

export async function CodePreviewServer({
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
