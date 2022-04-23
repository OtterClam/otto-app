import { useCallback, useEffect, useState } from 'react'
import { breakpoints } from 'styles/breakpoints'

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  const handleChange = useCallback((e: MediaQueryListEvent) => setMatches(e.matches), [])

  useEffect(() => {
    window.matchMedia(query).addEventListener('change', handleChange)
    return () => window.matchMedia(query).removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export const useBreakPoints = () => {
  const isMobile = useMediaQuery(breakpoints.mobile)
  return { isMobile }
}
