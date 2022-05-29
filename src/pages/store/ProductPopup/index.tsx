import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import { useBuyProduct } from 'contracts/functions'
import Product from 'models/store/Product'
import { useMyOttos } from 'MyOttosProvider'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/macro'
import { ContentSmall, Display3, Headline } from 'styles/typography'
import LoadingView from 'components/OpenItem/OpenItemLoadingView'
import OpenItemView from 'components/OpenItem/OpenItemView'
import Curtain from '../Curtain'
import AirdropProductCard from './AirdropProductCard'
import BuyProductCard from './BuyProductCard'
import HeroImage from './hero.png'

const StyledProductPopup = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px 75px;
  background: ${({ theme }) => theme.colors.otterBlack};
  position: relative;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  max-height: 80vh;
  overflow-y: auto;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 35px 10px;
  }
`

const StyledCurtain = styled(Curtain)`
  width: calc(100% - 2px);
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const StyledTopContainer = styled.div`
  margin-top: 50px;
  display: flex;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-top: 30px;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`

const StyledHeroImg = styled.img`
  width: 320px;
  height: 211px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
  }
`

const StyledInfoSection = styled.section``

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
  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 20px;
    right: 20px;
  }
`

export interface GroupedProduct {
  main: Product
  all: Product[]
}

enum State {
  ChoosePackage,
  Loading,
  Success,
}

interface Props {
  product: GroupedProduct
  onClose: () => void
}

export default function ProductPopup({ product: { main, all }, onClose }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { ottos } = useMyOttos()
  const { name, desc, airdropAmount } = main
  const [state, setState] = useState<State>(State.ChoosePackage)
  const [mode] = useState<'buy' | 'claim'>(airdropAmount > 0 ? 'claim' : 'buy')
  const { buy, buyState, resetBuy } = useBuyProduct(mode === 'claim')
  useEffect(() => {
    if (buyState.state === 'Success') {
      setState(State.Success)
    } else if (buyState.state === 'Fail' || buyState.state === 'Exception') {
      alert(buyState.status.errorMessage || '')
      setState(State.ChoosePackage)
      resetBuy()
    }
  }, [buyState])

  if (state === State.Loading) return <LoadingView type={main.type} />
  if (state === State.Success) return <OpenItemView items={buyState.receivedItems || []} onClose={onClose} />
  return (
    <Fullscreen background={theme.colors.white}>
      <StyledProductPopup>
        <StyledCurtain />
        <StyledTopContainer>
          <StyledHeroImg src={HeroImage} />
          <StyledInfoSection>
            <StyledTitle as="h1">{name}</StyledTitle>
            <StyledDesc as="p">{desc}</StyledDesc>
          </StyledInfoSection>
        </StyledTopContainer>
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
                setState(State.Loading)
                buy(
                  main,
                  ottos.map(o => o.tokenId)
                )
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
                  setState(State.Loading)
                  buy(p, [])
                }}
              />
            ))}
          </StyledPackageList>
        )}
        <StyledCloseButton color="white" onClose={onClose} />
      </StyledProductPopup>
    </Fullscreen>
  )
}
