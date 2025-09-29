import { unstable_cache } from 'next/cache'
import { cache as reactCache } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>

export function cache<T extends Callback>(
  cb: T,
  keyParts?: string[],
  options?: {
    revalidate?: number | false
    tags?: string[]
  },
) {
  return reactCache(unstable_cache(cb, keyParts, options))
}
