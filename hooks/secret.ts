import { useEffect, useRef } from 'react'

export function useSecret(decrypt: (input: string) => void, reset: () => void) {
  useEffect(() => {
    let input = ''
    let decrypted = false
    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event
      if (key === 'Enter' && !decrypted && input) {
        try {
          decrypt(input)
          decrypted = true
        } catch {
        } finally {
          input = ''
        }
        return
      }
      if (key === 'Escape' && decrypted) {
        reset()
        decrypted = false
        input = ''
        return
      }
      if (key.length > 1) {
        return
      }
      input += event.key
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  let count = 0
  const decrypted = useRef(false)
  return () => {
    count++
    if (count === 10) {
      try {
        if (!decrypted.current) {
          const key = prompt()
          decrypt(key ?? '')
          decrypted.current = true
        } else {
          reset()
          decrypted.current = false
        }
      } catch {
      } finally {
        count = 0
      }
    }
  }
}
