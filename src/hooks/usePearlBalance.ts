import { useEthers, useTokenBalance } from '@usedapp/core'
import useContractAddresses from './useContractAddresses'

export default function usePearlBalance() {
  const { account, chainId } = useEthers()
  const { PEARL } = useContractAddresses()
  return useTokenBalance(PEARL, account, { chainId })
}
