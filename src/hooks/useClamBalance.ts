import { useEthers, useTokenBalance } from '@usedapp/core'
import useContractAddresses from './useContractAddresses'

export default function useClamBalance() {
  const { account, chainId } = useEthers()
  const { CLAM } = useContractAddresses()
  return useTokenBalance(CLAM, account, { chainId })
}
