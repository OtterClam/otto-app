import { ChainId } from '@usedapp/core'

interface Addresses {
  CLAM: string
  OTTO: string
  PORTAL_CREATOR: string
  WETH: string
}

export const POLYGON_MAINNET: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  OTTO: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  PORTAL_CREATOR: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
}

export const OTTER_FORK: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  OTTO: '0x18B458D6f2349b293C624693bEdcFfE15C49543e',
  PORTAL_CREATOR: '0x52C7a9DDC1fE319a98Bd193b758Eaa4735738dDB',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
}

export function getContractAddresses(chainId: number): Addresses {
  switch (chainId) {
    case ChainId.Polygon:
      return POLYGON_MAINNET
    case 31338:
      return OTTER_FORK
    default:
      return POLYGON_MAINNET
  }
}
