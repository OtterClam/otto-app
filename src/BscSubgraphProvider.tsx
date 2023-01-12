import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createContext, PropsWithChildren, useMemo } from 'react'

const defaultValue = new ApolloClient({
  cache: new InMemoryCache(),
})

export const BscSubgraphContext = createContext(defaultValue)

export default function BscSubgraphProvider({ children }: PropsWithChildren<object>) {
  const uri = process.env.NEXT_PUBLIC_OTTER_GRAPH_ENDPOINT_BSC

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [uri]
  )

  return <BscSubgraphContext.Provider value={apolloClient}>{children}</BscSubgraphContext.Provider>
}
