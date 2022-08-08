import useResizeObserver from '@react-hook/resize-observer'
import { RefObject, useState } from 'react'
import useBrowserLayoutEffect from './useBrowserLayoutEffect'

export default function useSize(target: RefObject<HTMLElement>) {
  const [size, setSize] = useState<DOMRect>()

  useBrowserLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect())
    }
  }, [target])

  useResizeObserver(target, entry => setSize(entry.contentRect))

  return size
}
