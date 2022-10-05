import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { useAdventureOttos } from 'contexts/AdventureOttos'
import { LIST_MY_OTTOS } from 'graphs/otto'
import { useOttos } from 'hooks/useOtto'
import useRawOttos from 'hooks/useRawOttos'
import { sortBy } from 'lodash'
import Otto, { RawOtto } from 'models/Otto'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import { ListMyOttos, ListMyOttosVariables } from './graphs/__generated__/ListMyOttos'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
  reload: () => Promise<void>
}

export const MyOttosContext = createContext<MyOttos>({
  loading: true,
  ottos: [],
  reload: () => {
    return Promise.resolve()
  },
})

export function useMyOttos() {
  const { loading, ottos, reload } = useContext(MyOttosContext)
  return { loading, ottos, reload }
}

export function useIsMyOttos(ottoTokenId?: string): boolean {
  const { ottos } = useMyOttos()
  return useMemo(() => {
    return Boolean(ottos.find(otto => otto.tokenId === ottoTokenId))
  }, [ottos, ottoTokenId])
}

// this component must to be wrapped by AdventureOttosProvider
export default function MyOttosProvider({ children }: PropsWithChildren<any>) {
  const { ottos: adventureOttos, refetch: refetchAdventureOttos, loading } = useAdventureOttos()

  const adventureOttoIds = useMemo(() => adventureOttos.map(o => String(o.id)), [adventureOttos])
  const { data: adventureRawOttosData, loading: loadingRaw } = useRawOttos(adventureOttoIds)

  const { ottos, loading: loadingMeta } = useOttos(adventureRawOttosData?.ottos, { details: true })

  const reload = useCallback(() => {
    return refetchAdventureOttos()
  }, [])

  const myOttos = useMemo(
    () => ({
      loading: loading || loadingRaw || loadingMeta,
      ottos,
      reload,
    }),
    [loading, loadingMeta, ottos, reload]
  )

  return <MyOttosContext.Provider value={myOttos}>{children}</MyOttosContext.Provider>
}
