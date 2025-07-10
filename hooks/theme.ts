import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(media.matches ? 'dark' : 'light')
    const listener = (event: MediaQueryListEvent) =>
      setTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])
  return theme
}
