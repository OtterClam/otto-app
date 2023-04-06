import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { OttoBuyTransactionState } from 'contracts/functions'
import { ItemMetadata } from 'models/Item'
import { memo, useCallback, useEffect, useState, useRef } from 'react'

enum State {
  Loading,
  Success,
}

interface Props {
  coupon: ItemMetadata
  redeemState: OttoBuyTransactionState
  resetRedeem: () => void
  onErrorClose: () => void
  onClose: () => void
}

export default memo(function RedeemCouponPopup({
  coupon: { productType, productImages },
  redeemState,
  resetRedeem,
  onErrorClose,
  onClose,
}: Props) {
  const [state, setState] = useState<State>(State.Loading)

  useEffect(() => {
    if (redeemState.state === 'Success') {
      setState(State.Success)
    } else if (redeemState.state === 'Fail' || redeemState.state === 'Exception') {
      alert(redeemState.status.errorMessage || '')
      resetRedeem()
      onErrorClose()
    }
  }, [redeemState, onErrorClose, resetRedeem])

  if (state === State.Loading) return <LoadingView type={productType} images={productImages} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
})
