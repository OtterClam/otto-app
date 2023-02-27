import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import { ItemMetadata } from 'models/Item'
import { memo, useEffect, useState } from 'react'

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
  useEffect(() => {
    redeem(id, amount)
    setState(State.Loading)
  }, [])
  useEffect(() => {
    if (redeemState.state === 'Success') {
      setState(State.Success)
    } else if (redeemState.state === 'Fail' || redeemState.state === 'Exception') {
      alert(redeemState.status.errorMessage || '')
      resetRedeem()
      onErrorClose()
    }
  }, [redeemState])

  if (state === State.Loading) return <LoadingView type={productType} images={productImages} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
})
