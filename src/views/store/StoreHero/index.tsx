import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import { useEffect, useState } from 'react'
import Button from 'components/Button'
import ArrowDownWhite from 'assets/ui/arrow_down_white.svg'
import Bg from './store_bg.jpg'
import Otto1 from './store_otto1.png'
import Otto2 from './store_otto2.png'
import Arrow from './arrow.svg'

const StyledStoreHero = styled.div`
  width: 100%;
  position: relative;
`

const StyledBg = styled.img`
  width: 100%;
`

const Animation = keyframes`
  0%   {opacity: 0;}
  50%  {opacity: 1;}
`

const StyledOtto = styled.img<{ delay: number }>`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${Animation} 1000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);
`

const StyledDialog = styled.div`
  color: ${({ theme }) => theme.colors.otterBlack};
  background: white;
  position: absolute;
  top: 20%;
  left: 15%;
  width: 35%;
  border-radius: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    visibility: hidden;
  }

  &:after {
    content: '';
    width: 28px;
    height: 20px;
    background-image: url(${Arrow.src});
    background-size: 100% 100%;
    position: absolute;
    top: calc(50% - 9px);
    right: -30px;
  }
`

const StyledTitle = styled(Headline)``

const StyledSubtitle = styled(ContentSmall)``

const StyledShopButton = styled(Button)`
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%, 0);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledArrowDown = styled.img.attrs({ src: ArrowDownWhite.src })``

interface Props {
  className?: string
  onClickScroll: () => void
}

export default function StoreHero({ className, onClickScroll }: Props) {
  const { t } = useTranslation()
  const [state, setState] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => setState(state => (state === 1 ? 2 : 1)), 5000)
    return () => clearInterval(interval)
  }, [])
  return (
    <StyledStoreHero className={className}>
      <StyledBg src={Bg.src} />
      <StyledOtto src={Otto1.src} delay={0} />
      <StyledOtto src={Otto2.src} delay={500} />
      <StyledDialog>
        {state === 1 && (
          <>
            <StyledTitle as="h1">{t('store.hero')}</StyledTitle>
            <StyledSubtitle as="p">{t('store.subtitle_1')}</StyledSubtitle>
          </>
        )}
        {state === 2 && <StyledSubtitle as="p">{t('store.subtitle_2')}</StyledSubtitle>}
      </StyledDialog>
      <StyledShopButton Typography={Headline} onClick={onClickScroll}>
        <StyledButtonContent>
          {t('store.shop_button')}
          <StyledArrowDown />
        </StyledButtonContent>
      </StyledShopButton>
    </StyledStoreHero>
  )
}
