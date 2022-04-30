import { gql, useQuery } from '@apollo/client'
import { useCall, useEthers } from '@usedapp/core'
import { useOttos } from 'hooks/useOtto'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import { ListMyOttos, ListMyOttosVariables } from './__generated__/ListMyOttos'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
  reload: () => void
}

export const MyOttosContext = createContext<MyOttos>({
  loading: true,
  ottos: [],
  reload: () => {
    // noop
  },
})

export function useMyOttos() {
  const { loading, ottos, reload } = useContext(MyOttosContext)
  return { loading, ottos, reload }
}

export const LIST_MY_OTTOS = gql`
  query ListMyOttos($owner: Bytes!) {
    ottos(where: { owner: $owner, portalStatus: SUMMONED }, orderBy: tokenId) {
      tokenId
      tokenURI
      mintAt
      legendary
    }
  }
`

export default function MyOttosProvider({ children }: PropsWithChildren<any>) {
  const { account } = useEthers()
  const { data, loading, refetch } = useQuery<ListMyOttos, ListMyOttosVariables>(LIST_MY_OTTOS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const { ottos, loading: loadingMeta, refetch: refetchMeta } = useOttos(data?.ottos, true)
  const reload = useCallback(() => refetch().then(refetchMeta), [refetch, refetchMeta])
  const myOttos = useMemo(
    () => ({
      loading: loading || loadingMeta,
      ottos,
      reload,
    }),
    [loading, loadingMeta, ottos, reload]
  )
  return <MyOttosContext.Provider value={myOttos}>{children}</MyOttosContext.Provider>
}
