import { useWallet } from 'contexts/Wallet'
import { constants } from 'ethers'
import { useEffect, useReducer } from 'react'

export default function useTokenBalance(tokenAddress: string) {
  const wallet = useWallet()
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    if (!wallet) {
      return
    }

    const eventHandler = (receivedTokenAddress: string) => {
      if (receivedTokenAddress === tokenAddress) {
        forceUpdate()
      }
    }

    wallet.on('balanceUpdated', eventHandler)

    wallet.trackTokenBalance(tokenAddress)

    return () => {
      wallet.off('balanceUpdated', eventHandler)
    }
  }, [wallet, tokenAddress])

  return wallet?.getBalance(tokenAddress) ?? constants.Zero
}
