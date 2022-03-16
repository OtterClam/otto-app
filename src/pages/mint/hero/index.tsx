import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ContentMedium, Display2, Headline } from 'styles/typographs'
import heroImg from './otto_portal-hero.png'

const StyledHero = styled.section`
  width: 100%;
  height: 545px;
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  justify-items: center;
  gap: 30px;
`

const StyledContainer = styled.div`
  margin-top: 90px;
  margin-bottom: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
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
