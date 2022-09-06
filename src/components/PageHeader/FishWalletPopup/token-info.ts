import { BigNumber } from 'ethers'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import useContractAddresses from 'hooks/useContractAddresses'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { TransactionState, TransactionStatus } from '@usedapp/core'

const FISHIcon = CLAMIcon

export interface SwapTransactionState {
  state: TransactionState
  status: TransactionStatus
  amountOut?: string
}

export interface TokenInfo {
  icon: any
  balance?: BigNumber
  decimal: number
  address: string
  symbol: string
}

export const useTokenInfo = () => {
  const { CLAM, FISH } = useContractAddresses()

  const clamBalance = useTokenBalance(CLAM)
  const fishBalance = useTokenBalance(FISH)

  return useMemo(
    () => ({
      CLAM: {
        icon: CLAMIcon,
        balance: clamBalance,
        decimal: 9,
        address: CLAM,
        symbol: 'CLAM',
      },
      FISH: {
        icon: FISHIcon,
        balance: fishBalance,
        decimal: 18,
        address: FISH,
        symbol: 'FISH',
      },
    }),
    [fishBalance, clamBalance]
  )
}
