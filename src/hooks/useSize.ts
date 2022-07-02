import useResizeObserver from '@react-hook/resize-observer'
import { useState, useLayoutEffect, RefObject } from 'react'

export default function useSize(target: RefObject<HTMLElement>) {
  const [size, setSize] = useState<DOMRect>()

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect())
    }
  }, [target])

  useResizeObserver(target, entry => setSize(entry.contentRect))

  return size
}
