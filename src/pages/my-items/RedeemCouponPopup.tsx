import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import Item from 'models/Item'
import { useEffect, useState } from 'react'

enum State {
  Loading,
  Success,
}

interface Props {
  coupon: Item
  onClose: () => void
}

export default function RedeemCouponPopup({ coupon: { id, product_factory, product_type }, onClose }: Props) {
  const [state, setState] = useState<State>(State.Loading)
  const { resetRedeem, redeem, redeemState } = useRedeemProduct()
  useEffect(() => {
    redeem(id, product_factory)
  }, [])
  useEffect(() => {
    if (redeemState.state === 'Success') {
      setState(State.Success)
    } else if (redeemState.state === 'Fail' || redeemState.state === 'Exception') {
      alert(redeemState.status.errorMessage || '')
      resetRedeem()
      onClose()
    }
  }, [redeemState])

  if (state === State.Loading) return <LoadingView type={product_type} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
}
