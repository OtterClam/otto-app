import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { MyOttosContext } from 'MyOttosProvider'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useApi from './useApi'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(rawOtto: RawOtto | Falsy, details: boolean) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchCount, setFetchCount] = useState(0)
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const otto = useMemo(() => (rawOtto && metadata ? new Otto(rawOtto, metadata) : null), [rawOtto, metadata])
  useEffect(() => {
    if (rawOtto) {
      setLoading(true)
      setMetadata(null)
      setError(null)
      api
        .getOttoMeta(rawOtto.tokenId, i18n.resolvedLanguage, details)
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
  }, [rawOtto, i18n.resolvedLanguage, fetchCount])
  const refetch = () => setFetchCount(fetchCount + 1)
  return { loading, otto, error, refetch }
}

export function useOttos(rawOttos: RawOtto[] | Falsy, { details, epoch }: { details: boolean; epoch?: number }) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [ottos, setOttos] = useState<Otto[]>([])
  const [fetchCount, setFetchCount] = useState(0)
  useEffect(() => {
    if (rawOttos && rawOttos.length > 0) {
      setLoading(true)
      setError(null)
      const ids = rawOttos.map(raw => String(raw.tokenId))
      api
        .getOttoMetas(ids, i18n.resolvedLanguage, { details, epoch })
        .then(data => data.map((meta, i) => new Otto(rawOttos[i], meta)))
        .then(ottos => setOttos(ottos.filter((o): o is Otto => Boolean(o))))
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [rawOttos, i18n.resolvedLanguage, fetchCount])
  const refetch = () => setFetchCount(fetchCount + 1)
  return { loading, ottos, error, refetch }
}
