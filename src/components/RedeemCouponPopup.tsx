import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { useRedeemProduct } from 'contracts/functions'
import { ItemMetadata, Item } from 'models/Item'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentSmall, Headline, RegularInput } from 'styles/typography'

const StyledRedeemCouponPopup = styled.div`
  height: 90vh;
  padding: 35px 0;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`

const StyledRedeemContainer = styled.section`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
  }
`

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

const StyledInput = styled(RegularInput)`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  padding: 20px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

enum State {
  QueryAmount,
  Loading,
  Success,
}

interface Props {
  coupon: ItemMetadata
  item: Item | undefined
  onClose: () => void
}

export default memo(function RedeemCouponPopup({
  coupon: { tokenId: id, productType, productImages },
  item,
  onClose,
}: Props) {
  const [state, setState] = useState<State>(State.QueryAmount)
  const [amount, setAmount] = useState(1)
  const { resetRedeem, redeem, redeemState } = useRedeemProduct()
  const onRedeem = () => {
    redeem(id, amount)
    setState(State.Loading)
  }
  useEffect(() => {
    if (!item) {
      redeem(id, 1)
      setState(State.Loading)
    }
  }, [])
  useEffect(() => {
    if (redeemState.state === 'Success') {
      setState(State.Success)
    } else if (redeemState.state === 'Fail' || redeemState.state === 'Exception') {
      alert(redeemState.status.errorMessage || '')
      resetRedeem()
      setState(State.QueryAmount)
    }
  }, [redeemState])
  const submitted = state !== State.QueryAmount
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const maxAmount = item ? item.amount : 1

  if (state === State.QueryAmount)
    return (
      <Fullscreen show>
        <StyledRedeemCouponPopup>
          <StyledCloseButton onClose={onClose} />
          <StyledRedeemContainer>
            <Headline>{t('open')}</Headline>
            <ItemCell showDetailsPopup hideAmount item={item} size={240} />
            <StyledInputContainer>
              <ContentSmall>{t('transfer.amount')}</ContentSmall>
              <StyledInput
                disabled={submitted}
                type="number"
                max={maxAmount}
                min={1}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </StyledInputContainer>
            <Button Typography={Headline} width="100%" loading={submitted} onClick={onRedeem}>
              {t('open')}
            </Button>
          </StyledRedeemContainer>
        </StyledRedeemCouponPopup>
      </Fullscreen>
    )
  if (state === State.Loading) return <LoadingView type={productType} images={productImages} />
  return <OpenItemView items={redeemState.receivedItems || []} onClose={onClose} />
})
