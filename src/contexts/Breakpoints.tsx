import { breakpoints } from 'styles/breakpoints'
import { createContext, PropsWithChildren, useContext, useLayoutEffect, useMemo, useState } from 'react'

import { useMediaQuery } from 'react-responsive'
import { IS_SERVER } from 'constant'

export interface Breakpoints {
  isMobile: boolean
  isTablet: boolean
}

const defaultValue: Breakpoints = { isMobile: true, isTablet: true }

const BreakpointsContext = createContext<Breakpoints>(defaultValue)

// this hook will always return the default value when it is running on server side
export const BreakpointsProvider = ({ children }: PropsWithChildren<object>) => {
  const [ready, setReady] = useState(false)
  const isMobile = useMediaQuery({ query: breakpoints.mobile })
  const isTablet = useMediaQuery({ query: breakpoints.tablet })

  const value = useMemo(
    () =>
      !ready || IS_SERVER
        ? defaultValue
        : {
            isMobile,
            isTablet,
          },
    [ready, isMobile, isTablet]
  )

  // if we change the dom tree structure before the hydration process is finished, something will be broken.
  useLayoutEffect(() => {
    setReady(true)
  }, [])

  return <BreakpointsContext.Provider value={value}>{children}</BreakpointsContext.Provider>
}

export const useBreakpoints = () => useContext(BreakpointsContext)
