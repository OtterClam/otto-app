import { RefObject, useEffect } from 'react'

export default function useClickOutside<T>(ref: RefObject<T>, callback: () => void) {
  const handleClick = (e: any) => {
    if (ref.current && !(ref.current as any).contains(e.target)) {
      callback()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}
