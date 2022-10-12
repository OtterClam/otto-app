import { useEffect } from 'react'

export default (cb: () => void, ms: number, deps: unknown[] = []): void => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      timer = setTimeout(() => {
        cb()
        tick()
      }, ms)
    }

    tick()

    return () => {
      clearTimeout(timer)
    }
  }, [cb, ms, ...deps])
}
