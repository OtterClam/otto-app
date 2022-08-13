import { useWallet } from 'contexts/Wallet'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

export default function useTokenBalance(tokenAddress: string) {
  const wallet = useWallet()
  const [balance, setBanalce] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    if (!wallet) {
      setBanalce(BigNumber.from(0))
      return
    }

    const eventHandler = (receivedTokenAddress: string, balance: BigNumber) => {
      if (receivedTokenAddress === tokenAddress) {
        setBanalce(balance)
      }
    }

    wallet.on('balanceUpdated', eventHandler)

    wallet.trackTokenBalance(tokenAddress)

    return () => {
      wallet.off('balanceUpdated', eventHandler)
    }
  }, [wallet, tokenAddress])

  return balance
}
