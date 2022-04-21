import { gql, useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { useOttos } from 'hooks/useOtto'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useMemo } from 'react'
import { ListMyOttos, ListMyOttosVariables } from './__generated__/ListMyOttos'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
}

export const MyOttosContext = createContext<MyOttos>({ loading: false, ottos: [] })

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
  const { data, loading } = useQuery<ListMyOttos, ListMyOttosVariables>(LIST_MY_OTTOS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const { ottos, loading: loadingMeta } = useOttos(data?.ottos, true)
  const myOtto = useMemo(
    () => ({
      loading: loading || loadingMeta,
      ottos,
    }),
    [loading, loadingMeta, ottos]
  )
  return <MyOttosContext.Provider value={myOtto}>{children}</MyOttosContext.Provider>
}
