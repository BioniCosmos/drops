import { bundledLanguages, createHighlighter } from 'shiki'

export const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: Object.keys(bundledLanguages),
})
