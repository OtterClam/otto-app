import { BigNumber, constants } from 'ethers'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import FISHIcon from 'assets/tokens/FISH.svg'
import MATICIcon from 'assets/tokens/WMATIC.svg'
import USDCIcon from 'assets/tokens/USDC.svg'
import DAIIcon from 'assets/tokens/DAI.png'
import useContractAddresses from 'hooks/useContractAddresses'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { TransactionState, TransactionStatus, useEtherBalance, useEthers } from '@usedapp/core'

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

export const useTokenInfo = (): Record<string, TokenInfo> => {
  const {
    CLAM,
    FISH,
    tokens: { USDC, DAI },
  } = useContractAddresses()
  const { account } = useEthers()

  const maticBalance = useEtherBalance(account) || constants.Zero
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
      MATIC: {
        icon: MATICIcon,
        balance: maticBalance,
        decimal: 18,
        address: constants.AddressZero,
        symbol: 'MATIC',
      },
      USDC: {
        icon: USDCIcon,
        balance: constants.Zero,
        decimal: 6,
        address: USDC,
        symbol: 'USDC',
      },
      DAI: {
        icon: DAIIcon,
        balance: constants.Zero,
        decimal: 18,
        address: DAI,
        symbol: 'DAI',
      },
    }),
    [fishBalance, clamBalance, maticBalance]
  )
}
