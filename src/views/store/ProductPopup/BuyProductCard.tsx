import CLAM from 'assets/clam.png'
import BorderContainer from 'components/BorderContainer'
import Button from 'components/Button'
import Product from 'models/store/Product'
import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { Caption, ContentLarge, Headline, Note } from 'styles/typography'
import YellowRibbonXL from 'assets/ui/ribbon-yellow-xl.svg'
import Star from 'assets/ui/star.svg'
import useProductBorderColor from '../useProductBorderColor'

const StyledProductCard = styled(BorderContainer)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.darkGray400};
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledImage = styled.div`
  width: 190px;
  height: 190px;
  position: relative;

  > * {
    position: relative;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(${Star.src}) no-repeat;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledPrice = styled.div`
  display: flex;
  align-items: top;
  flex: 1;
  &:before {
    content: '';
    background-image: url(${CLAM.src});
    background-size: contain;
    background-repeat: no-repeat;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    display: block;
  }
`

const StyledOriginPrice = styled(ContentLarge)`
  text-decoration: line-through;
  margin-right: 10px;
`

const StyledDiscount = styled(Caption)`
  color: ${({ theme }) => theme.colors.clamPink};
`

const StyledMustItemRibbon = styled(Note).attrs({ as: 'div' })`
  position: absolute;
  width: 100%;
  height: 45px;
  top: -22.5px;
  left: 0;
  background: url(${YellowRibbonXL}) no-repeat;
  background-size: 100% 100%;
  z-index: 10;
  display: flex;
  padding-top: 8px;
  align-items: flex-start;
  justify-content: center;
`

interface Props {
  product: Product
  onClick: () => void
}

export default function BuyProductCard({
  product: { type, name, image, price, displayPrice, discountPrice, displayDiscountPrice, amount, mustDesc },
  onClick,
}: Props) {
  const { t } = useTranslation()
  const hasDiscount = price !== discountPrice
  const discount = (((Number(price) - Number(discountPrice)) / Number(price)) * 100).toFixed(0)
  const borderColor = useProductBorderColor(type)
  return (
    <StyledProductCard borderColor={borderColor}>
      <Headline>x {amount}</Headline>
      <StyledImage>
        <img src={image} alt={name} width="100%" />
      </StyledImage>
      <StyledPrice>
        {hasDiscount && <StyledOriginPrice>{displayPrice}</StyledOriginPrice>}
        <ContentLarge>{displayDiscountPrice}</ContentLarge>
      </StyledPrice>
      {hasDiscount && <StyledDiscount>{t('store.popup.discount', { discount })}</StyledDiscount>}
      <Button Typography={Headline} onClick={onClick}>
        {t('store.popup.buy_now')}
      </Button>
      {mustDesc && <StyledMustItemRibbon>{mustDesc}</StyledMustItemRibbon>}
    </StyledProductCard>
  )
}
