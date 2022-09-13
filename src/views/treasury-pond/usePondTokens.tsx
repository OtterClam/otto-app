import useClamBalance from 'hooks/useClamBalance'
import useContractAddresses from 'hooks/useContractAddresses'
import { useMemo } from 'react'
import SMALL_CLAM from 'assets/clam.svg'
import SMALL_PEARL from 'assets/pearl.png'
import CLAMCoin from 'assets/tokens/CLAM.svg'
import PEARLCoin from 'assets/tokens/PEARL.svg'
import useTokenBalance from 'hooks/useTokenBalance'

export default function usePondTokens() {
  const { CLAM, PEARL_BANK } = useContractAddresses()
  const clamBalance = useClamBalance()
  const pearlBalance = useTokenBalance(PEARL_BANK)
  return useMemo(
    () => ({
      CLAM: {
        id: 'CLAM',
        smallIcon: SMALL_CLAM.src,
        icon: CLAMCoin.src,
        balance: clamBalance,
        address: CLAM,
        symbol: 'CLAM',
        decimal: 9,
      },
      PEARL: {
        id: 'PEARL',
        smallIcon: SMALL_PEARL.src,
        icon: PEARLCoin.src,
        balance: pearlBalance,
        address: PEARL_BANK,
        symbol: 'PEARL',
        decimal: 9,
      },
    }),
    [clamBalance, CLAM, PEARL_BANK, pearlBalance]
  )
}
