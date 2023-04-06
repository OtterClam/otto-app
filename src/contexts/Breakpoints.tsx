import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { breakpoints } from 'styles/breakpoints'

import { IS_SERVER } from 'constant'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import { useMediaQuery } from 'react-responsive'

export interface Breakpoints {
  isMobile: boolean
  isSmallTablet: boolean
  isTablet: boolean
  isDesktop: boolean
}

const defaultValue: Breakpoints = { isMobile: true, isSmallTablet: true, isTablet: true, isDesktop: true }

const BreakpointsContext = createContext<Breakpoints>(defaultValue)

// this hook will always return the default value when it is running on server side
export const BreakpointsProvider = ({ children }: PropsWithChildren<object>) => {
  const [ready, setReady] = useState(false)
  const isMobile = useMediaQuery({ query: breakpoints.mobile })
  const isTablet = useMediaQuery({ query: breakpoints.tablet })
  const isSmallTablet = useMediaQuery({ query: breakpoints.smallTablet })
  const isDesktop = useMediaQuery({ query: breakpoints.desktop })

  const value = useMemo(
    () =>
      !ready || IS_SERVER
        ? defaultValue
        : {
            isMobile,
            isTablet,
            isSmallTablet,
            isDesktop,
          },
    [ready, isMobile, isTablet, isDesktop, isSmallTablet]
  )

  // if we change the dom tree structure before the hydration process is finished, something will be broken.
  useBrowserLayoutEffect(() => {
    setReady(true)
  }, [])

  return <BreakpointsContext.Provider value={value}>{children}</BreakpointsContext.Provider>
}

export const useBreakpoints = () => useContext(BreakpointsContext)
