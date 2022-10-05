import { formatDuration } from 'utils/duration'
import intervalToDuration from 'date-fns/intervalToDuration'
import { useEffect, useState } from 'react'

export default function useFormatedDuration(targetDate: Date): string {
  const [formatedDuration, setFormatedDuration] = useState('')

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const updateFormatedDuration = () => {
      const duration = intervalToDuration({
        start: new Date(),
        end: targetDate,
      })
      setFormatedDuration(formatDuration(duration))
      timer = setTimeout(updateFormatedDuration, 1000)
    }
    updateFormatedDuration()

    return () => {
      clearTimeout(timer)
    }
  }, [targetDate.getTime()])

  return formatedDuration
}
