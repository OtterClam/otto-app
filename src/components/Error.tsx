import { useTranslation } from 'next-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { changeNetwork } from '../helpers/web3'
import { clearError, ErrorButtonType, selectError } from '../store/errorSlice'
import Popup from './Popup'

const Error = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const error = useSelector(selectError)

  if (!error) return null

  return (
    <Popup
      show
      header={error.header}
      subHeader={error.subHeader}
      buttonText={error.button === ErrorButtonType.SWITCH_TO_MAINNET ? t('unsupported_network.action') : undefined}
      buttonAction={error.button === ErrorButtonType.SWITCH_TO_MAINNET ? () => changeNetwork(137) : undefined}
      close={() => dispatch(clearError())}
    />
  )
}

export default Error
