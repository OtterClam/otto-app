import { useEffect } from 'react'

let counter = 0

export default function useDisableBodyScroll(disabled: boolean) {
  useEffect(() => {
    if (disabled) {
      counter += 1
      document.body.style.overflow = 'hidden'

      return () => {
        counter -= 1
        if (!counter) {
          document.body.style.overflow = ''
        }
      }
    }
  }, [disabled])
}
