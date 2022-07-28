import { TransactionState, TransactionStatus, useEthers, useSendTransaction, useTokenBalance } from '@usedapp/core'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import USDCIcon from 'assets/tokens/USDC.svg'
import USDPlusIcon from 'assets/tokens/USDPlus.png'
import WMATICIcon from 'assets/tokens/WMATIC.svg'
import axios from 'axios'
import { AggregationRouterV4Abi } from 'contracts/abis'
import { getERC20 } from 'contracts/contracts'
import { BigNumber, ethers } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import useDebouncedEffect from 'hooks/useDebouncedEffect'
import { useEffect, useMemo, useState } from 'react'

export type Token = 'CLAM' | 'USD+' | 'USDC' | 'WMATIC'

export interface TokenInfo {
  icon: any
  balance?: BigNumber
  decimal: number
  address: string
  symbol: string
}

const FEE = 1 // 1% fee to DAO

export function useTokenList() {
  const { account } = useEthers()
  const {
    tokens: { CLAM, USDC, USDPlus, WMATIC },
  } = useContractAddresses()
  const clamBalance = useTokenBalance(CLAM, account)
  const usdcBalance = useTokenBalance(USDC, account)
  const usdPlusBalance = useTokenBalance(USDPlus, account)
  const wmaticBalance = useTokenBalance(WMATIC, account)
  return useMemo(
    () => ({
      CLAM: {
        icon: CLAMIcon,
        balance: clamBalance,
        decimal: 9,
        address: CLAM,
        symbol: 'CLAM',
      },
      USDC: {
        icon: USDCIcon,
        balance: usdcBalance,
        decimal: 6,
        address: USDC,
        symbol: 'USDC',
      },
      'USD+': {
        icon: USDPlusIcon,
        balance: usdPlusBalance,
        decimal: 6,
        address: USDPlus,
        symbol: 'USD+',
      },
      WMATIC: {
        icon: WMATICIcon,
        balance: wmaticBalance,
        decimal: 18,
        address: WMATIC,
        symbol: 'WMATIC',
      },
    }),
    [clamBalance, usdcBalance, usdPlusBalance, wmaticBalance, CLAM, USDC, USDPlus, WMATIC]
  )
}

interface QuoteParams {
  fromToken: string
  toToken: string
  amount: string
}

export function use1inchQuote({ fromToken, toToken, amount }: QuoteParams) {
  const [amountOut, setAmountOut] = useState('')
  useDebouncedEffect(
    () => {
      if (amount) {
        axios
          .get('https://api.1inch.io/v4.0/137/quote', {
            params: {
              fromTokenAddress: fromToken,
              toTokenAddress: toToken,
              amount,
              fee: FEE,
            },
          })
          .then(res => setAmountOut(res.data.toTokenAmount))
          .catch(console.error)
      } else {
        setAmountOut('')
      }
    },
    [fromToken, toToken, amount],
    500
  )
  return { amountOut }
}

type SwapState = TransactionState | 'Approving'

export interface SwapTransactionState {
  state: SwapState
  status: TransactionStatus
  amountOut?: string
}

interface SwapParams {
  fromToken: string
  toToken: string
  amount: string
  slippage: number
}

export function use1inchSwap() {
  const { account, library } = useEthers()
  const { sendTransaction, state, resetState } = useSendTransaction()
  const { ONE_INCH, DAO } = useContractAddresses()
  const [swapState, setSwapState] = useState<SwapTransactionState>({
    state: 'None',
    status: state,
  })
  const resetSwap = () => {
    resetState()
    setSwapState({ state: 'None', status: state })
  }
  const swap = async ({ fromToken, toToken, amount, slippage }: SwapParams) => {
    if (!account) {
      return
    }
    try {
      setSwapState({ state: 'PendingSignature', status: state })
      const fromERC20 = getERC20(fromToken, library?.getSigner())
      const allowance = await fromERC20.allowance(account, ONE_INCH)
      if (allowance.lt(amount)) {
        const tx = await fromERC20.approve(ONE_INCH, ethers.constants.MaxUint256)
        setSwapState({ state: 'Approving', status: state })
        await tx.wait()
      }
      const res = await axios.get('https://api.1inch.io/v4.0/137/swap', {
        params: {
          fromTokenAddress: fromToken,
          toTokenAddress: toToken,
          fromAddress: account,
          amount,
          slippage,
          fee: FEE,
          referrerAddress: DAO,
        },
      })
      const { tx } = res.data
      sendTransaction({
        from: tx.from,
        to: tx.to,
        data: tx.data,
      })
    } catch (err: any) {
      console.error(err)
      alert(err.message)
      resetSwap()
    }
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const routerInterface = new ethers.utils.Interface(AggregationRouterV4Abi)
      const amountOut = state.receipt?.logs
        .map(log => {
          try {
            return routerInterface.parseLog(log)
          } catch (err) {
            return null
          }
        })
        .find(e => e?.name === 'Swapped')?.args[5]
      setSwapState({ state: state.status, status: state, amountOut })
    } else {
      setSwapState({ state: state.status, status: state })
    }
  }, [state])
  return { swap, swapState, resetSwap }
}
