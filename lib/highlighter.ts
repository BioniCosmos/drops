import { createHighlighter } from 'shiki'
import { lang } from './lang'

export const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: Object.values(lang).map(({ shikiAlias }) => shikiAlias),
})
