import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainId, useEthers } from '@usedapp/core'
import { useMemo } from 'react'

export default function useApollo() {
  const { chainId } = useEthers()
  let uri = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    uri = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MUMBAI
  }
  const client = useMemo(
    () =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache(),
      }),
    [chainId, uri]
  )
  return client
}
