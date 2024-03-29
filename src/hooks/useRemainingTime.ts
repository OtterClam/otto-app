import { formatDuration } from 'utils/duration'
import intervalToDuration from 'date-fns/intervalToDuration'
import { useEffect, useState } from 'react'

export default function useRemainingTime(target: Date): string {
  const [formattedDuration, setFormattedDuration] = useState('')

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const updateFormattedDuration = () => {
      const now = new Date()
      const start = now > target ? target : now
      const duration = intervalToDuration({
        start,
        end: target,
      })
      setFormattedDuration(formatDuration(duration))
      timer = setTimeout(updateFormattedDuration, 1000)
    }
    updateFormattedDuration()

    return () => {
      clearTimeout(timer)
    }
  }, [target])

  return formattedDuration
}
