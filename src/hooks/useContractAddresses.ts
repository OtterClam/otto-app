import { ChainId, useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'
import { clearError, ErrorButtonType, setError } from '../store/errorSlice'
import { POLYGON_MAINNET, OTTER_FORK } from '../contracts/addresses'

const useContractAddresses = () => {
  const dispatch = useDispatch()
  const { chainId } = useEthers()

  if (chainId === ChainId.Polygon) {
    dispatch(clearError())
    return POLYGON_MAINNET
  }
  if ((chainId as number) === 31338) {
    dispatch(clearError())
    return OTTER_FORK
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
