import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createContext, PropsWithChildren, useMemo } from 'react'

const cache = new InMemoryCache({
  typePolicies: {
    OtterClamProposals: {
      fields: {
        proposals: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: false,

          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing, incoming) {
            return [...existing, ...incoming]
          },
        },
      },
    },
  },
})

const defaultValue = new ApolloClient({
  cache,
})
export const SnapshotContext = createContext(defaultValue)

export default function SnapshotProvider({ children }: PropsWithChildren<object>) {
  const uri = 'https://hub.snapshot.org/graphql'

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache,
      }),
    [uri]
  )

  return <SnapshotContext.Provider value={apolloClient}>{children}</SnapshotContext.Provider>
}
