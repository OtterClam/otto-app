import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import { ItemMetadata } from 'models/Item'
import { memo, useCallback, useEffect, useState, useRef } from 'react'

enum State {
  Loading,
  Success,
}

interface Props {
  coupon: ItemMetadata
  amount: number
  onErrorClose: () => void
  onClose: () => void
}

export default memo(function RedeemCouponPopup({
  coupon: { tokenId: id, productType, productImages },
  amount,
  onErrorClose,
  onClose,
}: Props) {
  const [state, setState] = useState<State>(State.Loading)
  const { resetRedeem, redeem, redeemState } = useRedeemProduct()

  const handleRedeemRef = useRef<() => void>(() => {
    // Default implementation that does nothing
  })

  useEffect(() => {
    handleRedeemRef.current = () => {
      redeem(id, amount)
      setState(State.Loading)
    }
  }, [redeem, id, amount])

  useEffect(() => {
    handleRedeemRef.current()
  }, [])

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
