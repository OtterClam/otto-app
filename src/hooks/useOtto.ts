import axios from 'axios'
import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useApi from './useApi'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(rawOtto: RawOtto | Falsy) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const otto = useMemo(() => (rawOtto && metadata ? new Otto(rawOtto, metadata) : null), [rawOtto, metadata])
  useEffect(() => {
    if (rawOtto) {
      setLoading(true)
      setMetadata(null)
      setError(null)
      api
        .getOttoMeta(rawOtto.tokenId, i18n.resolvedLanguage)
        .then(data => {
          setError(null)
          setMetadata(data)
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
