import { RefObject, useEffect } from 'react'

export default function useClickOutside<T>(ref: RefObject<T>, callback: () => void) {
  const handleClick = (e: any) => {
    if (ref.current && !(ref.current as any).contains(e.target)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('touchstart', handleClick, { passive: true })
    document.addEventListener('touchend', handleClick, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
      document.removeEventListener('touchend', handleClick)
    }
  })
}
