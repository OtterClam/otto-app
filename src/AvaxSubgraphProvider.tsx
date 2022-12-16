import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createContext, PropsWithChildren, useMemo } from 'react'

const defaultValue = new ApolloClient({
  cache: new InMemoryCache(),
})

export const AvaxSubgraphContext = createContext(defaultValue)

export default function AvaxSubgraphProvider({ children }: PropsWithChildren<object>) {
  let uri = process.env.NEXT_PUBLIC_OTTER_GRAPH_ENDPOINT_AVALANCHE

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [uri]
  )

  return <AvaxSubgraphContext.Provider value={apolloClient}>{children}</AvaxSubgraphContext.Provider>
}
