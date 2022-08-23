import useTokenBalance from 'hooks/useTokenBalance'
import useContractAddresses from './useContractAddresses'

export default function useClamBalance() {
  const { CLAM } = useContractAddresses()
  return useTokenBalance(CLAM)
}
