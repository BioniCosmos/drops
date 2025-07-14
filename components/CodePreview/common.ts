export interface CodePreviewProps {
  content: string
  language: string
  preview?: boolean
  maxLines?: number
}

export function getContentPreview(
  content: string,
  maxLines: number = 10,
): string {
  const lines = content.split('\n')
  if (lines.length <= maxLines) {
    return content
  }
  return lines.slice(0, maxLines).join('\n')
}
