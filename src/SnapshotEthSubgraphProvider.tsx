import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainId, useEthers } from '@usedapp/core'
import { createContext, PropsWithChildren, useMemo } from 'react'

const defaultValue = new ApolloClient({
  cache: new InMemoryCache(),
})

export const SnapshotEthContext = createContext(defaultValue)

export default function SnapshotEthProvider({ children }: PropsWithChildren<object>) {
  const { chainId } = useEthers()
  let uri = 'https://hub.snapshot.org/graphql'

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [uri]
  )

  return <SnapshotEthContext.Provider value={apolloClient}>{children}</SnapshotEthContext.Provider>
}
