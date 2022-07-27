import { TransactionState, TransactionStatus, useEthers, useSendTransaction } from '@usedapp/core'
import axios from 'axios'
import { AggregationRouterV4Abi } from 'contracts/abis'
import { getERC20 } from 'contracts/contracts'
import { ethers } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import useDebouncedEffect from 'hooks/useDebouncedEffect'
import { useEffect, useState } from 'react'

interface QuoteParams {
  fromToken: string
  toToken: string
  amount: string
}

const FEE = 1 // 1% fee to DAO

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

interface SwapTransactionState {
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
      const fromERC20 = getERC20(fromToken, library?.getSigner())
      const allowance = await fromERC20.allowance(account, ONE_INCH)
      if (allowance.lt(amount)) {
        await (await fromERC20.approve(ONE_INCH, ethers.constants.MaxUint256)).wait()
        setSwapState({ state: 'Approving', status: state })
      }
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
