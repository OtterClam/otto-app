import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import { Product } from 'models/Product'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Display3, Headline } from 'styles/typography'
import AirdropProductCard from './AirdropProductCard'
import BuyProductCard from './BuyProductCard'

const StyledProductPopup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px 75px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledTitle = styled(Display3)``

const StyledDesc = styled(ContentSmall)``

const StyledChoosePackage = styled(Headline)`
  text-align: center;
`

const StyledAirdropContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StyledPackageList = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 40px;
  right: 40px;
`

export interface GroupedProduct {
  main: Product
  all: Product[]
}

interface Props {
  product: GroupedProduct
  onClose: () => void
}

export default function ProductPopup({ product: { main, all }, onClose }: Props) {
  const { t } = useTranslation()
  const { name, desc, airdropAmount } = main
  return (
    <Fullscreen background="white">
      <StyledProductPopup>
        <StyledTitle as="h1">{name}</StyledTitle>
        <StyledDesc as="p">{desc}</StyledDesc>
        <StyledChoosePackage>
          {airdropAmount > 0
            ? t('store.popup.claim_title', { amount: airdropAmount })
            : t('store.popup.choose_package')}
        </StyledChoosePackage>
        {airdropAmount > 0 && (
          <StyledAirdropContainer>
            <AirdropProductCard
              product={main}
              onClick={() => {
                // TODO: claim airdrop
              }}
            />
          </StyledAirdropContainer>
        )}
        {airdropAmount === 0 && (
          <StyledPackageList>
            {all.map((p, index) => (
              <BuyProductCard
                key={index}
                product={p}
                onClick={() => {
                  // TODO: buy product
                }}
              />
            ))}
          </StyledPackageList>
        )}
        <StyledCloseButton onClose={onClose} />
      </StyledProductPopup>
    </Fullscreen>
  )
}
