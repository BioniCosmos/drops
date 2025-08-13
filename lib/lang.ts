import { LanguageName, loadLanguage } from '@uiw/codemirror-extensions-langs'
import { BundledLanguage } from 'shiki'

export type Lang = keyof typeof lang

export function loadCodeMirrorLang(langValue: string) {
  if (!(langValue in lang) || langValue === 'plaintext') {
    return []
  }
  return [loadLanguage(lang[langValue as Lang].codeMirrorAlias)!]
}

export function loadShikiLang(langValue: string) {
  if (!(langValue in lang)) {
    return 'text'
  }
  return lang[langValue as Lang].shikiAlias
}

export function getLangName(langValue: string) {
  if (!(langValue in lang)) {
    return 'Plaintext'
  }
  return lang[langValue as Lang].name
}

export function getLangExtension(langValue: string) {
  if (!(langValue in lang)) {
    return '.txt'
  }
  return lang[langValue as Lang].extension
}

export function getLangFromExtension(extension: string) {
  return (
    Object.entries(lang).find(([_, v]) => v.extension === extension)?.[0] ??
    'plaintext'
  )
}

export function getSupportedExtensions() {
  return Object.values(lang).map(({ extension }) => extension)
}

export const lang = {
  c: { name: 'C', codeMirrorAlias: 'c', shikiAlias: 'c', extension: '.c' },
  clisp: {
    name: 'Common Lisp',
    codeMirrorAlias: 'commonLisp',
    shikiAlias: 'common-lisp',
    extension: '.lisp',
  },
  clojure: {
    name: 'Clojure',
    codeMirrorAlias: 'clojure',
    shikiAlias: 'clojure',
    extension: '.clj',
  },
  cpp: {
    name: 'C++',
    codeMirrorAlias: 'cpp',
    shikiAlias: 'cpp',
    extension: '.cpp',
  },
  csharp: {
    name: 'C#',
    codeMirrorAlias: 'csharp',
    shikiAlias: 'csharp',
    extension: '.cs',
  },
  css: {
    name: 'CSS',
    codeMirrorAlias: 'css',
    shikiAlias: 'css',
    extension: '.css',
  },
  dart: {
    name: 'Dart',
    codeMirrorAlias: 'dart',
    shikiAlias: 'dart',
    extension: '.dart',
  },
  erlang: {
    name: 'Erlang',
    codeMirrorAlias: 'erlang',
    shikiAlias: 'erlang',
    extension: '.erl',
  },
  go: { name: 'Go', codeMirrorAlias: 'go', shikiAlias: 'go', extension: '.go' },
  haskell: {
    name: 'Haskell',
    codeMirrorAlias: 'haskell',
    shikiAlias: 'haskell',
    extension: '.hs',
  },
  haxe: {
    name: 'Haxe',
    codeMirrorAlias: 'haxe',
    shikiAlias: 'haxe',
    extension: '.hx',
  },
  html: {
    name: 'HTML',
    codeMirrorAlias: 'html',
    shikiAlias: 'html',
    extension: '.html',
  },
  java: {
    name: 'Java',
    codeMirrorAlias: 'java',
    shikiAlias: 'java',
    extension: '.java',
  },
  javascript: {
    name: 'JavaScript',
    codeMirrorAlias: 'javascript',
    shikiAlias: 'javascript',
    extension: '.js',
  },
  json: {
    name: 'JSON',
    codeMirrorAlias: 'json',
    shikiAlias: 'json',
    extension: '.json',
  },
  jsx: {
    name: 'JSX',
    codeMirrorAlias: 'jsx',
    shikiAlias: 'jsx',
    extension: '.jsx',
  },
  kotlin: {
    name: 'Kotlin',
    codeMirrorAlias: 'kotlin',
    shikiAlias: 'kotlin',
    extension: '.kt',
  },
  lua: {
    name: 'Lua',
    codeMirrorAlias: 'lua',
    shikiAlias: 'lua',
    extension: '.lua',
  },
  markdown: {
    name: 'Markdown',
    codeMirrorAlias: 'markdown',
    shikiAlias: 'markdown',
    extension: '.md',
  },
  mermaid: {
    name: 'Mermaid',
    codeMirrorAlias: 'mermaid',
    shikiAlias: 'mermaid',
    extension: '.mmd',
  },
  nginx: {
    name: 'Nginx',
    codeMirrorAlias: 'nginx',
    shikiAlias: 'nginx',
    extension: '.conf',
  },
  objc: {
    name: 'Objective-C',
    codeMirrorAlias: 'objectiveC',
    shikiAlias: 'objective-c',
    extension: '.m',
  },
  php: {
    name: 'PHP',
    codeMirrorAlias: 'php',
    shikiAlias: 'php',
    extension: '.php',
  },
  plaintext: {
    name: 'Plaintext',
    codeMirrorAlias: '' as LanguageName,
    shikiAlias: 'text' as BundledLanguage,
    extension: '.txt',
  },
  protobuf: {
    name: 'Protocol Buffers',
    codeMirrorAlias: 'protobuf',
    shikiAlias: 'proto',
    extension: '.proto',
  },
  python: {
    name: 'Python',
    codeMirrorAlias: 'python',
    shikiAlias: 'python',
    extension: '.py',
  },
  rust: {
    name: 'Rust',
    codeMirrorAlias: 'rust',
    shikiAlias: 'rust',
    extension: '.rs',
  },
  scala: {
    name: 'Scala',
    codeMirrorAlias: 'scala',
    shikiAlias: 'scala',
    extension: '.scala',
  },
  scheme: {
    name: 'Scheme',
    codeMirrorAlias: 'scheme',
    shikiAlias: 'scheme',
    extension: '.scm',
  },
  smalltalk: {
    name: 'Smalltalk',
    codeMirrorAlias: 'smalltalk',
    shikiAlias: 'smalltalk',
    extension: '.st',
  },
  sql: {
    name: 'SQL',
    codeMirrorAlias: 'sql',
    shikiAlias: 'sql',
    extension: '.sql',
  },
  svelte: {
    name: 'Svelte',
    codeMirrorAlias: 'svelte',
    shikiAlias: 'svelte',
    extension: '.svelte',
  },
  swift: {
    name: 'Swift',
    codeMirrorAlias: 'swift',
    shikiAlias: 'swift',
    extension: '.swift',
  },
  toml: {
    name: 'TOML',
    codeMirrorAlias: 'toml',
    shikiAlias: 'toml',
    extension: '.toml',
  },
  tsx: {
    name: 'TSX',
    codeMirrorAlias: 'tsx',
    shikiAlias: 'tsx',
    extension: '.tsx',
  },
  typescript: {
    name: 'TypeScript',
    codeMirrorAlias: 'typescript',
    shikiAlias: 'typescript',
    extension: '.ts',
  },
  vue: {
    name: 'Vue',
    codeMirrorAlias: 'vue',
    shikiAlias: 'vue',
    extension: '.vue',
  },
  xml: {
    name: 'XML',
    codeMirrorAlias: 'xml',
    shikiAlias: 'xml',
    extension: '.xml',
  },
  yaml: {
    name: 'YAML',
    codeMirrorAlias: 'yaml',
    shikiAlias: 'yaml',
    extension: '.yml',
  },
} as const satisfies Record<
  string,
  {
    name: string
    codeMirrorAlias: LanguageName
    shikiAlias: BundledLanguage
    extension: string
  }
>
