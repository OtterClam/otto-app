import { ChainId } from '@usedapp/core'
import axios from 'axios'

export function getApi(chainId: number) {
  let baseURL = process.env.REACT_APP_API_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    baseURL = process.env.REACT_APP_API_ENDPOINT_MUMBAI
  }
  return axios.create({ baseURL })
}
