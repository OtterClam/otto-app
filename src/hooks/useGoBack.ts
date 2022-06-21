import { IS_SERVER } from 'constant'
import { useCallback, useEffect, useState } from 'react'

export default function useGoBack() {
  const [historyLength, setHistoryLength] = useState(IS_SERVER ? 0 : window.history.length)
  const goBack = useCallback(() => window.history.back(), [])

  useEffect(() => {
    const listener = () => {
      setHistoryLength(window.history.length)
    }
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  return {
    historyLength,
    goBack,
  }
}
