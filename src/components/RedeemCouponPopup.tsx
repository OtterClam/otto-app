import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import { ItemMetadata, Item } from 'models/Item'
import { memo, useEffect, useState } from 'react'

enum State {
  Loading,
  Success,
}

interface Props {
  coupon: ItemMetadata
  onClose: () => void
}

export default memo(function RedeemCouponPopup({
  coupon: { tokenId: id, productFactory, productType },
  onClose,
}: Props) {
  const [state, setState] = useState<State>(State.Loading)
  const { resetRedeem, redeem, redeemState } = useRedeemProduct()
  useEffect(() => {
    redeem(id, productFactory)
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

  if (state === State.Loading) return <LoadingView type={productType} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
})
