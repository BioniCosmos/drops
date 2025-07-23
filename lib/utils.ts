import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const second = 60
export const minute = 60 * second
export const hour = 60 * minute
export const day = 24 * hour
export const year = 365 * day

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
