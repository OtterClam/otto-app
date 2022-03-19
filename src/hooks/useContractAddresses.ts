import { ChainId, useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'
import { clearError, ErrorButtonType, setError } from '../store/errorSlice'
import { POLYGON_MAINNET, LOCALHOST } from '../contracts/addresses'

const useContractAddresses = () => {
  const dispatch = useDispatch()
  const { chainId } = useEthers()

  if (chainId === ChainId.Polygon) {
    dispatch(clearError())
    return POLYGON_MAINNET
  }
  if (chainId === ChainId.Hardhat) {
    dispatch(clearError())
    return LOCALHOST
  }
  if (!chainId) {
    dispatch(clearError())
    return POLYGON_MAINNET
  }

  dispatch(
    setError({
      header: 'Unsupported Network',
      subHeader: 'Only Polygon Mainnet are supported',
      button: ErrorButtonType.SWITCH_TO_MAINNET,
    })
  )
  return POLYGON_MAINNET
}

export default useContractAddresses
