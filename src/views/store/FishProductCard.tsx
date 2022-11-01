import FISH from 'assets/fish.png'
import Star from 'assets/ui/star.svg'
import BorderContainer from 'components/BorderContainer'
import Button from 'components/Button'
import ItemCell from 'components/ItemCell'
import { useBuyFishItem } from 'contracts/functions'
import { trim } from 'helpers/trim'
import { FishStoreProduct } from 'libs/api'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, Headline, Caption } from 'styles/typography'
import BuyFishItemPopup from './BuyFishItemPopup'
import FishProductCountdown from './FishProductCountdown'

const StyledProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.darkGray400};
`

const StyledContainer = styled(BorderContainer)`
  width: 260px;
  padding: 15px;
  background: ${({ theme }) => theme.colors.darkGray400};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledTitle = styled(Headline)`
  text-align: center;
  height: 20px;
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledItemContainer = styled.div`
  width: 225px;
  height: 225px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    position: relative;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 225px;
    height: 225px;
    background: url(${Star.src}) no-repeat;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledOriginPrice = styled(ContentLarge)`
  text-decoration: line-through;
  margin-right: 10px;
  font-size: 14px;
`

const StyledPrice = styled.div`
  display: flex;
  align-items: center;
  margin-top: -20px;
  &:before {
    content: '';
    background-image: url(${FISH.src});
    background-size: contain;
    background-repeat: no-repeat;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    display: block;
  }
`

const StyledDiscount = styled(Caption)`
  color: ${({ theme }) => theme.colors.clamPink};
`

interface Props {
  product: FishStoreProduct
  button?: string
}

export default function FishProductCard({
  product: { id, item, price, displayPrice, discountPrice, displayDiscountPrice, end_time },
  button,
}: Props) {
  const { t } = useTranslation()
  const { buy, buyState, resetBuy } = useBuyFishItem()
  const hasDiscount = price !== discountPrice
  const discount = (((Number(price) - Number(discountPrice)) / Number(price)) * 100).toFixed(0)

  useEffect(() => {
    if (buyState.state === 'Fail') {
      alert(buyState.status.errorMessage)
      resetBuy()
    }
  }, [buyState])
  return (
    <>
      <StyledContainer>
        <StyledProductCard>
          <StyledTitle>{item.metadata.name}</StyledTitle>
          <StyledItemContainer>
            <ItemCell item={item} />
          </StyledItemContainer>
          <StyledPrice>
            {hasDiscount && <StyledOriginPrice>{displayPrice}</StyledOriginPrice>}
            <ContentLarge>{displayDiscountPrice}</ContentLarge>
          </StyledPrice>
          {hasDiscount && <StyledDiscount>{t('store.popup.discount', { discount })}</StyledDiscount>}
          <Button
            Typography={Headline}
            width="100%"
            loading={buyState.state === 'Processing'}
            onClick={() => {
              buy(id, discountPrice)
            }}
          >
            {button || t('store.product_card.buy_btn')}
          </Button>
          <FishProductCountdown target={end_time} />
        </StyledProductCard>
      </StyledContainer>
      <BuyFishItemPopup state={buyState} item={item} onClose={() => resetBuy()} />
    </>
  )
}
