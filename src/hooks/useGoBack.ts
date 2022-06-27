import { IS_SERVER } from 'constant'
import { useCallback, useEffect, useState } from 'react'

const getHistoryLength = () => (window.location.pathname === '/' ? 0 : window.history.length)

export default function useGoBack() {
  const [historyLength, setHistoryLength] = useState(IS_SERVER ? 0 : getHistoryLength())
  const goBack = useCallback(() => {
    window.history.back()
  }, [historyLength])

  useEffect(() => {
    const listener = () => {
      setHistoryLength(getHistoryLength())
    }
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  return {
    historyLength,
    goBack,
  }
}
