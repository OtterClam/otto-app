import { useCallback, useLayoutEffect, useState } from 'react'
import { breakpoints } from 'styles/breakpoints'

// TODO: should wrap the logic and state into a react context or put them into a react store
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  const handleChange = useCallback((e: MediaQueryListEvent) => setMatches(e.matches), [])

  useLayoutEffect(() => {
    window.matchMedia(query).addEventListener('change', handleChange)
    setMatches(window.matchMedia(query).matches)
    return () => window.matchMedia(query).removeEventListener('change', handleChange)
  }, [query, handleChange])

  return matches
}

export const useBreakPoints = () => {
  const isMobile = useMediaQuery(breakpoints.mobile)
  return { isMobile }
}
