import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { useApi } from 'contexts/Api'
import { LIST_MY_OTTOS } from 'graphs/otto'
import { ListMyOttos, ListMyOttosVariables } from 'graphs/__generated__/ListMyOttos'
import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'

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
        .getOttoMeta(rawOtto.tokenId, details)
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

  const refetch = useCallback(() => {
    if (rawOttos && rawOttos.length > 0 && epoch !== -1) {
      setLoading(true)
      setError(null)
      const ids = rawOttos.map(raw => String(raw.tokenId))
      api
        .getOttoMetas(ids, { details, epoch })
        .then(data => data.map((meta, i) => new Otto(rawOttos[i], meta)))
        .then(ottos => setOttos(ottos.filter((o): o is Otto => Boolean(o))))
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [rawOttos, i18n.resolvedLanguage, epoch])

  useEffect(refetch, [rawOttos, i18n.resolvedLanguage, epoch])

  return { loading, ottos, error, refetch }
}

export function useMyOttos(epoch: number) {
  const { account } = useEthers()
  const { data, loading, refetch } = useQuery<ListMyOttos, ListMyOttosVariables>(LIST_MY_OTTOS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const { ottos, loading: loadingMeta, refetch: refetchMeta } = useOttos(data?.ottos, { details: true, epoch })
  const reload = useCallback(() => refetch().then(refetchMeta), [refetch, refetchMeta])
  const myOttos = useMemo(
    () => ({
      loading: loading || loadingMeta,
      ottos,
      reload,
    }),
    [loading, loadingMeta, ottos, reload]
  )
  return myOttos
}
