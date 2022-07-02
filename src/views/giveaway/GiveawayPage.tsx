import Star from 'assets/ui/star.svg'
import BorderContainer from 'components/BorderContainer'
import Silver from 'models/store/images/silver.png'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentMedium, Display2 } from 'styles/typography'
import GiveawayFAQ from './GiveawayFAQ'
import GiveawaySteps from './GiveawaySteps'
import HeroBg from './hero-bg.png'

const StyledGiveawayPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  align-items: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
`

const StyledHeadline = styled(Display2).attrs({ as: 'h1' })`
  text-align: center;
`

const StyledSubtitle = styled(ContentMedium).attrs({ as: 'h2' })`
  text-align: center;
`

const StyledHero = styled.div`
  display: flex;
  justify-content: center;
  width: 640px;
  background-image: url(${HeroBg.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top;
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledSliverChestContainer = styled.div`
  width: 360px;
  height: 360px;
  position: relative;

  > * {
    position: relative;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 360px;
    height: 360px;
    background: url(${Star.src}) no-repeat;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledBody = styled(BorderContainer)`
  width: 95%;
  max-width: 640px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 42px 35px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 42px 15px;
  }
`

export default function GiveawayPage() {
  const { t } = useTranslation('', { keyPrefix: 'giveaway' })
  return (
    <StyledGiveawayPage>
      <StyledHeadline>{t('headline')}</StyledHeadline>
      <StyledSubtitle>{t('subtitle')}</StyledSubtitle>
      <StyledHero>
        <StyledSliverChestContainer>
          <img src={Silver.src} alt="silver" width="100%" />
        </StyledSliverChestContainer>
      </StyledHero>
      <StyledBody>
        <GiveawaySteps />
        <GiveawayFAQ />
      </StyledBody>
    </StyledGiveawayPage>
  )
}
