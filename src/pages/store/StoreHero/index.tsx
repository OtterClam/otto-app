import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import { useEffect, useState } from 'react'
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
    background-image: url(${Arrow});
    background-size: 100% 100%;
    position: absolute;
    top: calc(50% - 9px);
    right: -30px;
  }
`

const StyledTitle = styled(Headline)``

const StyledSubtitle = styled(ContentSmall)``

export default function StoreHero() {
  const { t } = useTranslation()
  const [state, setState] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => setState(state => (state === 1 ? 2 : 1)), 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <StyledStoreHero>
      <StyledBg src={Bg} />
      <StyledOtto src={Otto1} delay={0} />
      <StyledOtto src={Otto2} delay={500} />
      <StyledDialog>
        {state === 1 && (
          <>
            <StyledTitle as="h1">{t('store.hero')}</StyledTitle>
            <StyledSubtitle as="p">{t('store.subtitle_1')}</StyledSubtitle>
          </>
        )}
        {state === 2 && <StyledSubtitle as="p">{t('store.subtitle_2')}</StyledSubtitle>}
      </StyledDialog>
    </StyledStoreHero>
  )
}
