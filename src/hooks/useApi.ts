import { ChainId, useEthers } from '@usedapp/core'
import axios from 'axios'
import { useMemo } from 'react'

export default function useApi() {
  const { chainId } = useEthers()
  let uri = process.env.REACT_APP_API_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    uri = process.env.REACT_APP_API_ENDPOINT_MUMBAI
  }
  const client = useMemo(
    () =>
      axios.create({
        baseURL: uri,
      }),
    [chainId, uri]
  )
  return client
}
