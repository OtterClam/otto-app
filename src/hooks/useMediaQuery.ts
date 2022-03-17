import { useCallback, useEffect, useState } from 'react'

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  const handleChange = useCallback((e: MediaQueryListEvent) => setMatches(e.matches), [])

  useEffect(() => {
    window.matchMedia(query).addEventListener('change', handleChange)
    return () => window.matchMedia(query).removeEventListener('change', handleChange)
  }, [query])

  return matches
}
