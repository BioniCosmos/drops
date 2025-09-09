import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const pageSize = 10

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hash(secret: string) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(secret),
  )
  return new Uint8Array(buf)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
