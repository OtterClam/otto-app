import axios from 'axios'
import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { useEffect, useMemo, useState } from 'react'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(rawOtto: RawOtto | Falsy) {
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const otto = useMemo(() => (rawOtto && metadata ? new Otto(rawOtto, metadata) : null), [rawOtto, metadata])
  useEffect(() => {
    if (rawOtto)
      axios
        .get<OttoMeta>(rawOtto.tokenURI)
        .then(res => {
          setMetadata(res.data)
        })
        .catch(err => console.error('fetch otto meta failed', err))
        .finally(() => setLoading(false))
  }, [rawOtto])
  return { loading, otto }
}
