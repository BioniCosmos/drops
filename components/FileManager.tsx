'use client'

import { formatBytes } from '@/lib/utils'
import clsx from 'clsx'
import {
  Archive,
  Code,
  DownloadIcon,
  FileIcon,
  FileText,
  ImageIcon,
  Music,
  RotateCcw,
  Trash2,
  UploadIcon,
  Video,
  X,
} from 'lucide-react'
import mime from 'mime'
import { ChangeEventHandler, DragEventHandler, useState } from 'react'
import { ulid } from 'ulid'
import { create } from 'zustand'

const useFileStore = create<{
  xFiles: Map<string, XFile>
  xFileAdd: (id: string, file: XFile) => void
  xFileRemove: (id: string) => void
  iFiles: Set<string>
  iFileAdd: (id: string) => void
  iFileRemove: (id: string) => void
}>((set) => ({
  xFiles: new Map(),
  iFiles: new Set(),
  xFileAdd: (id, file) =>
    set((state) => ({ xFiles: new Map(state.xFiles).set(id, file) })),
  xFileRemove: (id) =>
    set((state) => {
      const xFiles = new Map(state.xFiles)
      xFiles.delete(id)
      return { xFiles }
    }),
  iFileAdd: (id) => set((state) => ({ iFiles: new Set(state.iFiles).add(id) })),
  iFileRemove: (id) =>
    set((state) => {
      const iFiles = new Set(state.iFiles)
      iFiles.delete(id)
      return { iFiles }
    }),
}))

export function useFiles() {
  const { xFiles, iFiles } = useFileStore()
  return {
    newFiles: [...xFiles.values()],
    filesToDel: [...iFiles.values()],
  }
}

export function FileManager({
  files = [],
  readonly = false,
}: {
  files?: FileItem[]
  readonly?: boolean
}) {
  const { xFiles, xFileAdd, xFileRemove, iFiles, iFileAdd, iFileRemove } =
    useFileStore()

  function add(file: File) {
    const id = ulid()
    xFileAdd(id, {
      id,
      filename: file.name,
      mimeType: mime.getType(file.name) ?? 'application/octet-stream',
      size: file.size,
      file,
    })
  }

  function cancel(file: FileItem) {
    xFileRemove(file.id)
  }

  function markDel(file: FileItem) {
    iFileAdd(file.id)
  }

  function unmarkDel(file: FileItem) {
    iFileRemove(file.id)
  }

  return (
    <div className="space-y-4">
      {[...files, ...xFiles.values()].map((file) => (
        <FileItem
          key={file.id}
          file={toInner(file, xFiles, iFiles)}
          cancel={cancel.bind(null, file)}
          markDel={markDel.bind(null, file)}
          unmarkDel={unmarkDel.bind(null, file)}
          readonly={readonly}
        />
      ))}
      {!readonly && <Upload add={(files) => files.forEach(add)} />}
    </div>
  )
}

function Upload({ add }: { add: (files: File[]) => void }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    validateAndAddFiles(e.dataTransfer.files)
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.files) {
      validateAndAddFiles(e.currentTarget.files)
      e.currentTarget.value = ''
    }
  }

  function validateAndAddFiles(fileList: FileList) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const validFiles = [...fileList].filter((file) => {
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds 10 MB limit.`)
        return false
      }
      return true
    })
    add(validFiles)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="space-y-3">
        <div className="flex justify-center">
          <UploadIcon size={48} className="text-gray-400" />
        </div>
        <div>
          <p className="font-medium">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500 mt-1">
            Maximum file size: 10MB per file
          </p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </div>
    </div>
  )
}

type FileItem = {
  id: string
  filename: string
  mimeType: string
  size: number
}

export type XFile = FileItem & { file: File }

type InnerFileItem = FileItem & { status: '+' | '-' | 'o' }

function toInner(
  file: FileItem,
  xFiles: Map<string, FileItem>,
  iFiles: Set<string>,
) {
  const inXFiles = xFiles.has(file.id)
  const inIFiles = iFiles.has(file.id)
  let status: '+' | '-' | 'o'
  if (inXFiles) {
    status = '+'
  } else if (inIFiles) {
    status = '-'
  } else {
    status = 'o'
  }
  return { ...file, status }
}

function FileItem({
  file,
  cancel,
  markDel,
  unmarkDel,
  readonly,
}: {
  file: InnerFileItem
  cancel: () => void
  markDel: () => void
  unmarkDel: () => void
  readonly?: boolean
}) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between p-3 rounded-lg border transition-all',
        {
          'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700':
            !file.status,
          'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700':
            file.status === '+',
          'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 opacity-75':
            file.status === '-',
        },
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div
          className={clsx('flex items-center justify-center w-8 h-8', {
            'grayscale opacity-60': file.status === '-',
          })}
        >
          <Icon file={file} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={clsx('text-sm font-medium truncate', {
              'line-through text-gray-500 dark:text-gray-400':
                file.status === '-',
            })}
          >
            {file.filename}
          </p>
          <p
            className={clsx(
              'text-xs',
              file.status === '-'
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-500',
            )}
          >
            {formatBytes(file.size)} • {file.mimeType}
            {file.status === '+' && (
              <>
                {' • '}
                <span className="text-blue-600 dark:text-blue-400">New</span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {file.status === '+' ? (
          <Cancel cancel={cancel} />
        ) : (
          <>
            <Download file={file} />
            {!readonly && (
              <MarkDel file={file} markDel={markDel} unmarkDel={unmarkDel} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Icon({ file }: { file: FileItem }) {
  const iconProps = {
    size: 20,
    className: 'text-gray-600 dark:text-gray-400',
  }
  if (file.mimeType.startsWith('image/')) {
    return <ImageIcon {...iconProps} />
  }
  if (file.mimeType.startsWith('video/')) {
    return <Video {...iconProps} />
  }
  if (file.mimeType.startsWith('audio/')) {
    return <Music {...iconProps} />
  }
  if (file.mimeType.includes('pdf') || file.mimeType.includes('text/')) {
    return <FileText {...iconProps} />
  }
  if (file.mimeType.includes('zip') || file.mimeType.includes('archive')) {
    return <Archive {...iconProps} />
  }
  if (
    file.mimeType.includes('javascript') ||
    file.mimeType.includes('typescript') ||
    file.mimeType.includes('json')
  ) {
    return <Code {...iconProps} />
  }
  return <FileIcon {...iconProps} />
}

function Cancel({ cancel }: { cancel: () => void }) {
  return (
    <button
      type="button"
      onClick={cancel}
      className="p-1 text-red-500 hover:text-red-700 transition-colors flex items-center justify-center"
      title="Remove"
    >
      <X size={16} />
    </button>
  )
}

function Download({ file }: { file: FileItem }) {
  return (
    <a
      href={`/files/${file.id}`}
      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center"
      title="Download"
      download
    >
      <DownloadIcon size={16} />
    </a>
  )
}

function MarkDel({
  file,
  markDel,
  unmarkDel,
}: {
  file: InnerFileItem
  markDel: () => void
  unmarkDel: () => void
}) {
  return (
    <button
      type="button"
      onClick={file.status === '-' ? unmarkDel : markDel}
      className={clsx(
        'px-2 py-1 text-sm rounded transition-colors flex items-center gap-1',
        file.status === '-'
          ? 'text-green-500 hover:text-green-700'
          : 'text-red-500 hover:text-red-700',
      )}
      title={file.status === '-' ? 'Restore file' : 'Mark for deletion'}
    >
      {file.status === '-' ? <RotateCcw size={14} /> : <Trash2 size={14} />}
    </button>
  )
}
