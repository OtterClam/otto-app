import { IS_SERVER } from 'constant'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const getHistoryLength = () => (window.location.pathname === '/' ? 0 : window.history.length)

export default function useGoBack() {
  const [historyLength, setHistoryLength] = useState(() => (IS_SERVER ? 0 : getHistoryLength()))
  const { pathname } = useRouter()

  const goBack = useCallback(() => {
    window.history.back()
  }, [historyLength])

  useEffect(() => {
    if (IS_SERVER) {
      return
    }
    setHistoryLength(getHistoryLength())
  }, [pathname])

  return {
    historyLength,
    goBack,
  }
}
