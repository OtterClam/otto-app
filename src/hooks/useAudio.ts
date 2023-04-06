import { useMemo, useState } from 'react'

export default function useAudio(audioUrl: string, preload = true) {
  const [err, setErr] = useState<Error | undefined>()

  const audio = useMemo(() => {
    setErr(undefined)
    const audio = new Audio(audioUrl)
    audio.onerror = () => {
      setErr(e => e || err)
    }
    if (preload) {
      audio.load()
    }
    return audio
  }, [audioUrl, preload, err])

  return { audio, audioError: err }
}
