import { ChainId, useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo } from 'react'
import { clearError, ErrorButtonType, setError } from '../store/errorSlice'
import { POLYGON_MAINNET, LOCALHOST, POLYGON_MUMBAI } from '../contracts/addresses'

const addresses: { [key: number]: typeof POLYGON_MAINNET } = {
  [ChainId.Polygon]: POLYGON_MAINNET,
  [ChainId.Mumbai]: POLYGON_MUMBAI,
  [ChainId.Hardhat]: LOCALHOST,
}

const useContractAddresses = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { chainId, active, isLoading, account, activateBrowserWallet } = useEthers()

  useEffect(() => {
    if (!active || isLoading || Object.keys(addresses).includes(String(chainId))) {
      dispatch(clearError())
    } else if (!account) {
      activateBrowserWallet()
    } else {
      dispatch(
        setError({
          header: t('unsupported_network.title') + chainId,
          subHeader: t('unsupported_network.desc'),
          button: ErrorButtonType.SWITCH_TO_MAINNET,
        })
      )
    }
  }, [chainId, active, dispatch, t, isLoading, account, activateBrowserWallet])

  return useMemo(() => {
    return addresses[chainId ?? -1] ?? POLYGON_MAINNET
  }, [chainId])
}

export default useContractAddresses
