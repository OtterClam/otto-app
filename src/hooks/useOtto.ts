import axios from 'axios'
import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(rawOtto: RawOtto | Falsy) {
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const { i18n } = useTranslation()
  const otto = useMemo(() => (rawOtto && metadata ? new Otto(rawOtto, metadata) : null), [rawOtto, metadata])
  useEffect(() => {
    if (rawOtto) {
      setLoading(true)
      axios
        .get<OttoMeta>(rawOtto.tokenURI, { params: { lang: i18n.resolvedLanguage } })
        .then(res => {
          setError(null)
          setMetadata(res.data)
        })
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [rawOtto, i18n.resolvedLanguage])
  return { loading, otto, error }
}
