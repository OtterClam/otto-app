import { useMemo, useState } from 'react'

export default function useAudio(audioUrl: string, preload = true) {
  const [err, setErr] = useState<Error | undefined>()

  const audio = useMemo(() => {
    setErr(undefined)
    const audio = new Audio(audioUrl)
    audio.onerror = () => {
      setErr(err)
    }
    if (preload) {
      audio.load()
    }
    return audio
  }, [audioUrl, preload])

  return { audio, audioError: err }
}
