import { IS_SERVER } from 'constant'
import { useCallback, useEffect, useState } from 'react'
import { breakpoints } from 'styles/breakpoints'

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    return !IS_SERVER && window.matchMedia(query).matches
  })

  const handleChange = useCallback((e: MediaQueryListEvent) => setMatches(e.matches), [])

  useEffect(() => {
    if (IS_SERVER) {
      return
    }
    window.matchMedia(query).addEventListener('change', handleChange)
    return () => window.matchMedia(query).removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export const useBreakPoints = () => {
  const isMobile = useMediaQuery(breakpoints.mobile)
  return { isMobile }
}
