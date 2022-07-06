import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createContext, PropsWithChildren, useMemo } from 'react'

const defaultValue = new ApolloClient({
  cache: new InMemoryCache(),
})

export const SnapshotContext = createContext(defaultValue)

export default function SnapshotProvider({ children }: PropsWithChildren<object>) {
  let uri = 'https://hub.snapshot.org/graphql'

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [uri]
  )

  return <SnapshotContext.Provider value={apolloClient}>{children}</SnapshotContext.Provider>
}
