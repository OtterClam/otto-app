import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainId, useEthers } from '@usedapp/core'
import { createContext, PropsWithChildren, useMemo } from 'react'

const defaultValue = new ApolloClient({
  cache: new InMemoryCache(),
})

export const OtterSubgraphContext = createContext(defaultValue)

export default function OtterSubgraphProvider({ children }: PropsWithChildren<object>) {
  const { chainId } = useEthers()
  let uri = process.env.NEXT_PUBLIC_OTTER_GRAPH_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    uri = process.env.NEXT_PUBLIC_OTTER_GRAPH_ENDPOINT_MUMBAI
  }

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [uri]
  )

  return <OtterSubgraphContext.Provider value={apolloClient}>{children}</OtterSubgraphContext.Provider>
}
