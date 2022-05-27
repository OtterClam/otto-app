import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import { useCouponProduct } from 'contracts/views'
import { useEffect, useState } from 'react'

enum State {
  Loading,
  Success,
}

interface Props {
  couponId: string
  onClose: () => void
}

export default function RedeemCouponPopup({ couponId, onClose }: Props) {
  const [state, setState] = useState<State>(State.Loading)
  const { resetRedeem, redeem, redeemState } = useRedeemProduct()
  const { factory, type } = useCouponProduct(couponId)
  console.log({ factory, type })
  useEffect(() => {
    if (factory) {
      redeem(couponId, factory)
    }
  }, [factory])
  useEffect(() => {
    if (redeemState.state === 'Success') {
      setState(State.Success)
    } else if (redeemState.state === 'Fail' || redeemState.state === 'Exception') {
      alert(redeemState.status.errorMessage || '')
      resetRedeem()
      onClose()
    }
  }, [redeemState])

  if (state === State.Loading) return <LoadingView type={type} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
}
