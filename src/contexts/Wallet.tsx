import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import Wallet from 'libs/wallet'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

const WalletContext = createContext<Wallet | null>(null)

export const WalletProvider = ({ children }: PropsWithChildren<object>) => {
  const { account, library } = useEthers()
  const [wallet, setWallet] = useState<Wallet | null>(null)

  useEffect(() => {
    if (library && account) {
      const wallet = new Wallet({
        ethersProvider: library ?? ethers.getDefaultProvider(),
        accountAddress: account ?? '',
      })

      setWallet(wallet)

      return () => {
        wallet.destroy()
      }
    }
    setWallet(null)
  }, [account, library])

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export const useWallet = () => useContext(WalletContext)
