import { useEffect } from 'react'

export function useSecret(decrypt: (input: string) => void, reset: () => void) {
  let input = ''
  let decrypted = false
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event
      if (key === 'Enter' && !decrypted && input) {
        try {
          decrypt(input)
          decrypted = true
        } catch (e) {
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
}
