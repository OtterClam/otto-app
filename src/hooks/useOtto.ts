import { useApi } from 'contexts/Api'
import Otto, { RawOtto } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(id: string | Falsy, details: boolean) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchCount, setFetchCount] = useState(0)
  const [raw, setRaw] = useState<RawOtto | null>(null)
  const otto = useMemo(() => (raw ? new Otto(raw) : null), [raw])
  useEffect(() => {
    if (id) {
      setLoading(true)
      setRaw(null)
      setError(null)
      api
        .getOttoMeta(id, details)
        .then(data => {
          setError(null)
          setRaw(data)
        })
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [id, i18n.resolvedLanguage, fetchCount, api, details])
  const refetch = () => setFetchCount(fetchCount + 1)
  return { loading, otto, error, refetch }
}

export function useOttos(ids: string[] | Falsy, { details, epoch }: { details: boolean; epoch?: number }) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [ottos, setOttos] = useState<Otto[]>([])
  const [fetchCount, setFetchCount] = useState(0)
  useEffect(() => {
    if (ids && ids.length > 0) {
      setLoading(true)
      setError(null)
      api
        .getOttoMetas(ids, { details, epoch })
        .then(data => data.map(raw => new Otto(raw)))
        .then(ottos => setOttos(ottos.filter((o): o is Otto => Boolean(o))))
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [ids, i18n.resolvedLanguage, fetchCount])
  const refetch = () => setFetchCount(fetchCount + 1)
  return { loading, ottos, error, refetch }
}
