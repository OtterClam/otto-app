import { useCall, useEthers } from '@usedapp/core'
import { Contract, utils } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { abi as OttopiaPortalCreator } from './OttopiaPortalCreator.json'

// export const useTokenSymbol = (token: string) => {
//   const [symbol] = useContractCall({
//     abi: new utils.Interface(erc20Abi),
//     address: token,
//     method: 'symbol',
//     args: [],
//   }) ?? ['---']
//   return symbol
// }

export const useETHMintPrice = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library, chainId } = useEthers()
  const contract = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const { value, error } =
    useCall({
      contract,
      method: 'priceInWETH',
      args: [],
    }) || {}
  if (error) {
    console.error(error)
    return '0.0'
  }
  return value ? utils.formatEther(value[0]) : '0.0'
}
