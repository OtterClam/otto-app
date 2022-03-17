import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ContentMedium, Display2, Headline } from 'styles/typography'
import heroImg from './otto_portal-hero.png'

const StyledHero = styled.section`
  width: 100%;
  height: 40vw;
  padding: 60px 90px;
  display: flex;
  justify-content: center;
  gap: 30px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    height: auto;
    padding: 40px 10px;
  }
`

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`

const StyledText = styled.p``

const StyledPink = styled.p`
  color: ${props => props.theme.colors.clamPink};
`

const StyledHeroImage = styled.div`
  flex: 1;
  background-image: url(${heroImg});
  background-size: contain;
  background-repeat: no-repeat;
`

export default function Hero() {
  const { t } = useTranslation()
  return (
    <StyledHero>
      <StyledContainer>
        <StyledText>
          <Display2>{t('mint.hero.title')}</Display2>
        </StyledText>
        <StyledText>
          <Headline>{t('mint.hero.subtitle')}</Headline>
        </StyledText>
        <StyledText>
          <ContentMedium>{t('mint.hero.desc')}</ContentMedium>
        </StyledText>
        <StyledPink>
          <ContentMedium>{t('mint.hero.limit')}</ContentMedium>
        </StyledPink>
      </StyledContainer>
      <StyledHeroImage />
    </StyledHero>
  )
}
