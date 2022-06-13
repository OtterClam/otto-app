import { useEthers } from '@usedapp/core'
import Button, { ButtonProps } from 'components/Button'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { connectWallet } from 'store/uiSlice'

export type { ButtonProps as TxButtonProps } from 'components/Button'

export default function TxButton({ onClick, children, ...restProps }: ButtonProps) {
  const { account } = useEthers()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClickWrapper = () => {
    if (!account) {
      dispatch(connectWallet())
      return
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button onClick={onClickWrapper} {...restProps}>
      {account ? children : t('connect_wallet')}
    </Button>
  )
}
