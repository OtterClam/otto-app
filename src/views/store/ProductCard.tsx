import CLAM from 'assets/clam.png'
import Star from 'assets/ui/star.svg'
import Button from 'components/Button'
import { trim } from 'helpers/trim'
import Product from 'models/store/Product'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { Caption, ContentLarge, Headline } from 'styles/typography'

const StyledProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.darkGray400};
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledImage = styled.div`
  width: 225px;
  height: 225px;
  position: relative;

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

const StyledPrice = styled.div`
  display: flex;
  align-items: center;
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

const StyledAirdropAmount = styled.p`
  color: ${({ theme }) => theme.colors.crownYellow};
`

interface Props {
  product: Product
  enabled?: boolean
  onClick: () => void
  button?: string
}

export default function ProductCard({
  product: { name, image, displayPrice, airdropAmount },
  enabled = true,
  button,
  onClick,
}: Props) {
  const { t } = useTranslation()
  return (
    <StyledProductCard>
      <Headline>{name}</Headline>
      <StyledImage>
        <img src={image} alt={name} width="100%" />
      </StyledImage>
      <StyledPrice>
        <ContentLarge>{trim(displayPrice, 2)}</ContentLarge>
      </StyledPrice>
      <Button Typography={Headline} disabled={!enabled} onClick={onClick}>
        {button || t('store.product_card.select')}
      </Button>
      {airdropAmount > 0 && (
        <StyledAirdropAmount>
          <Caption>{t('store.product_card.airdrop', { amount: airdropAmount })}</Caption>
        </StyledAirdropAmount>
      )}
    </StyledProductCard>
  )
}
