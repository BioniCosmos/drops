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

export const lang = {
  c: { name: 'C', codeMirrorAlias: 'c', shikiAlias: 'c' },
  clisp: {
    name: 'Common Lisp',
    codeMirrorAlias: 'commonLisp',
    shikiAlias: 'common-lisp',
  },
  clojure: {
    name: 'Clojure',
    codeMirrorAlias: 'clojure',
    shikiAlias: 'clojure',
  },
  cpp: { name: 'C++', codeMirrorAlias: 'cpp', shikiAlias: 'cpp' },
  csharp: { name: 'C#', codeMirrorAlias: 'csharp', shikiAlias: 'csharp' },
  css: { name: 'CSS', codeMirrorAlias: 'css', shikiAlias: 'css' },
  dart: { name: 'Dart', codeMirrorAlias: 'dart', shikiAlias: 'dart' },
  erlang: { name: 'Erlang', codeMirrorAlias: 'erlang', shikiAlias: 'erlang' },
  go: { name: 'Go', codeMirrorAlias: 'go', shikiAlias: 'go' },
  haskell: {
    name: 'Haskell',
    codeMirrorAlias: 'haskell',
    shikiAlias: 'haskell',
  },
  haxe: { name: 'Haxe', codeMirrorAlias: 'haxe', shikiAlias: 'haxe' },
  html: { name: 'HTML', codeMirrorAlias: 'html', shikiAlias: 'html' },
  java: { name: 'Java', codeMirrorAlias: 'java', shikiAlias: 'java' },
  javascript: {
    name: 'JavaScript',
    codeMirrorAlias: 'javascript',
    shikiAlias: 'javascript',
  },
  json: { name: 'JSON', codeMirrorAlias: 'json', shikiAlias: 'json' },
  jsx: { name: 'JSX', codeMirrorAlias: 'jsx', shikiAlias: 'jsx' },
  kotlin: { name: 'Kotlin', codeMirrorAlias: 'kotlin', shikiAlias: 'kotlin' },
  lua: { name: 'Lua', codeMirrorAlias: 'lua', shikiAlias: 'lua' },
  markdown: {
    name: 'Markdown',
    codeMirrorAlias: 'markdown',
    shikiAlias: 'markdown',
  },
  mermaid: {
    name: 'Mermaid',
    codeMirrorAlias: 'mermaid',
    shikiAlias: 'mermaid',
  },
  nginx: { name: 'Nginx', codeMirrorAlias: 'nginx', shikiAlias: 'nginx' },
  objc: {
    name: 'Objective-C',
    codeMirrorAlias: 'objectiveC',
    shikiAlias: 'objective-c',
  },
  php: { name: 'PHP', codeMirrorAlias: 'php', shikiAlias: 'php' },
  plaintext: {
    name: 'Plaintext',
    codeMirrorAlias: '' as LanguageName,
    shikiAlias: 'text' as BundledLanguage,
  },
  protobuf: {
    name: 'Protocol Buffers',
    codeMirrorAlias: 'protobuf',
    shikiAlias: 'proto',
  },
  python: { name: 'Python', codeMirrorAlias: 'python', shikiAlias: 'python' },
  rust: { name: 'Rust', codeMirrorAlias: 'rust', shikiAlias: 'rust' },
  scala: { name: 'Scala', codeMirrorAlias: 'scala', shikiAlias: 'scala' },
  scheme: { name: 'Scheme', codeMirrorAlias: 'scheme', shikiAlias: 'scheme' },
  smalltalk: {
    name: 'Smalltalk',
    codeMirrorAlias: 'smalltalk',
    shikiAlias: 'smalltalk',
  },
  sql: { name: 'SQL', codeMirrorAlias: 'sql', shikiAlias: 'sql' },
  svelte: { name: 'Svelte', codeMirrorAlias: 'svelte', shikiAlias: 'svelte' },
  swift: { name: 'Swift', codeMirrorAlias: 'swift', shikiAlias: 'swift' },
  toml: { name: 'TOML', codeMirrorAlias: 'toml', shikiAlias: 'toml' },
  tsx: { name: 'TSX', codeMirrorAlias: 'tsx', shikiAlias: 'tsx' },
  typescript: {
    name: 'TypeScript',
    codeMirrorAlias: 'typescript',
    shikiAlias: 'typescript',
  },
  vue: { name: 'Vue', codeMirrorAlias: 'vue', shikiAlias: 'vue' },
  xml: { name: 'XML', codeMirrorAlias: 'xml', shikiAlias: 'xml' },
  yaml: { name: 'YAML', codeMirrorAlias: 'yaml', shikiAlias: 'yaml' },
} as const satisfies Record<
  string,
  { name: string; codeMirrorAlias: LanguageName; shikiAlias: BundledLanguage }
>
