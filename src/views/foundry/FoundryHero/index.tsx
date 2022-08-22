import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import Bg from './foundry_bg.jpg'
import Fg1 from './foundry_fg1.png'
import Fg2 from './foundry_fg2.png'
import Otto1 from './otto_smith1.png'
import Otto2 from './otto_smith2.png'
import Arrow from './arrow.svg'

const StyledFoundryHero = styled.div`
  width: 100%;
  position: relative;
`

const StyledBg = styled.div`
  width: 100%;
  height: 520px;
  background: no-repeat center / cover url(${Bg.src});

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 400px;
  }
`

const Animation = keyframes`
  0%   {opacity: 0;}
  50%  {opacity: 1;}
`

const StyledFg = styled.div<{ src: string; delay: number }>`
  width: 100%;
  height: 520px;
  background: no-repeat center / cover url(${({ src }) => src});
  position: absolute;
  top: 0;
  left: 0;
  animation: ${Animation} 2000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 400px;
  }
`

const StyledOtto = styled.img<{ delay: number }>`
  width: 382px;
  position: absolute;
  bottom: 0;
  right: 15%;
  animation: ${Animation} 2000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 179px;
    right: 5%;
  }
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

export default function FoundryHero() {
  const { t } = useTranslation('', { keyPrefix: 'foundry' })
  return (
    <StyledFoundryHero>
      <StyledBg />
      <StyledFg src={Fg1.src} delay={0} />
      <StyledFg src={Fg2.src} delay={1000} />
      <StyledOtto src={Otto1.src} delay={0} />
      <StyledOtto src={Otto2.src} delay={1000} />
      <StyledDialog>
        <StyledTitle as="h1">{t('dialog.title')}</StyledTitle>
        <StyledSubtitle as="p">{t('dialog.content')}</StyledSubtitle>
      </StyledDialog>
    </StyledFoundryHero>
  )
}
