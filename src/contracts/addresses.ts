import { ChainId } from '@usedapp/core'

interface Addresses {
  CLAM: string
  WETH: string
  OTTO: string
  PORTAL_CREATOR: string
}

export const POLYGON_MAINNET: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  OTTO: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  PORTAL_CREATOR: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
}

export const OTTER_FORK: Addresses = {
  CLAM: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  OTTO: '0xd3bC207ffA860B389D2EC35075605147c2A98670',
  PORTAL_CREATOR: '0xA2B66209A3872257F4FC2532bF35138f466f13ea',
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
