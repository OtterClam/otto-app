import { useEffect, useState } from 'react'

export default function useIsAtTop() {
  const check = () => typeof window === 'undefined' || window.pageYOffset === 0
  const [isAtTop, setIsAtTop] = useState(check())

  useEffect(() => {
    const listener = () => {
      setIsAtTop(check())
    }
    document.addEventListener('scroll', listener)
    return () => document.removeEventListener('scroll', listener)
  }, [])

  return isAtTop
}
