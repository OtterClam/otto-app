import { ChainId } from '@usedapp/core'

interface Addresses {
  CLAM: string
  WETH: string
  OTTO: string
  PORTAL_CREATOR: string
}

export const POLYGON_MAINNET: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  OTTO: '0x6e8A9Cb6B1E73e9fCe3FD3c68b5af9728F708eB7',
  PORTAL_CREATOR: '0xCb8Ba0c08e746CA6fa79fe535580f89A8eC082C2',
}

export const POLYGON_MUMBAI: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  OTTO: '0x4B3B717EA62c36eb6274BD0813C3f48ccDf94b9F',
  PORTAL_CREATOR: '0xCb8Ba0c08e746CA6fa79fe535580f89A8eC082C2',
}

export const LOCALHOST: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  OTTO: '0x6e8A9Cb6B1E73e9fCe3FD3c68b5af9728F708eB7',
  PORTAL_CREATOR: '0xCb8Ba0c08e746CA6fa79fe535580f89A8eC082C2',
}

export function getContractAddresses(chainId: number): Addresses {
  switch (chainId) {
    case ChainId.Polygon:
      return POLYGON_MAINNET
    case ChainId.Hardhat:
      return LOCALHOST
    default:
      return POLYGON_MAINNET
  }
}
