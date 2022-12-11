import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { useApi } from 'contexts/Api'
import { useRepositories } from 'contexts/Repositories'
import { LIST_MY_OTTOS } from 'graphs/otto'
import { ListMyOttos, ListMyOttosVariables } from 'graphs/__generated__/ListMyOttos'
import Otto from 'models/Otto'
import { useMyOtto } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Falsy = false | 0 | '' | null | undefined

export default function useOtto(id: string | Falsy, details: boolean) {
  const api = useApi()
  const { i18n } = useTranslation()
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchCount, setFetchCount] = useState(0)
  const { ottos: ottosRepo } = useRepositories()
  const [otto, setOtto] = useState<Otto | null>(null)

  // TODO: fucking hack
  const myOtto = useMyOtto(id || undefined)

  useEffect(() => {
    if (id) {
      setLoading(true)
      setOtto(null)
      setError(null)
      ottosRepo
        .getOtto(id)
        .then(setOtto)
        .catch(err => {
          setError(err)
          console.error('fetch otto meta failed', err)
        })
        .finally(() => setLoading(false))
    }
  }, [id, i18n.resolvedLanguage, fetchCount, api, details])

  const refetch = () => setFetchCount(fetchCount + 1)

  return { loading, otto: myOtto ?? otto, error, refetch }
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

export function useMyOttos(epoch?: number) {
  const { account } = useEthers()
  const { data, loading, refetch } = useQuery<ListMyOttos, ListMyOttosVariables>(LIST_MY_OTTOS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const ottoIds = useMemo(() => (data?.ottos ? data.ottos.map(otto => otto.tokenId) : []), [data])
  const { ottos, loading: loadingMeta, refetch: refetchMeta } = useOttos(ottoIds, { details: true, epoch })
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
