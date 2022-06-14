import { ChainId, useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { clearError, ErrorButtonType, setError } from '../store/errorSlice'
import { POLYGON_MAINNET, LOCALHOST, POLYGON_MUMBAI } from '../contracts/addresses'

const useContractAddresses = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { chainId } = useEthers()

  useEffect(() => {
    if (!chainId || Object.values(ChainId).includes(chainId)) {
      dispatch(clearError())
    } else {
      dispatch(
        setError({
          header: t('unsupported_network.title'),
          subHeader: t('unsupported_network.desc'),
          button: ErrorButtonType.SWITCH_TO_MAINNET,
        })
      )
    }
  }, [chainId])

  return useMemo(() => {
    const addresses: { [key: number]: typeof POLYGON_MAINNET } = {
      [ChainId.Polygon]: POLYGON_MAINNET,
      [ChainId.Mumbai]: POLYGON_MUMBAI,
      [ChainId.Hardhat]: LOCALHOST,
    }
    return addresses[chainId ?? -1] ?? POLYGON_MAINNET
  }, [chainId])
}

export default useContractAddresses
