import Button from 'components/Button'
import { WHITE_PAPER_LINK } from 'constant'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentMedium, Display2, Headline } from 'styles/typography'
import heroImg from './otto_portal-hero.png'

const StyledHero = styled.section`
  width: 100%;
  height: 40vw;
  padding: 60px 90px;
  display: flex;
  justify-content: center;
  gap: 30px;
  color: #fff;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    height: auto;
    padding: 40px 10px;
    align-items: center;
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

const StyledDesc = styled.p`
  margin-top: 20px;
`

const StyledPink = styled.p`
  color: ${props => props.theme.colors.clamPink};
`

const StyledHeroImage = styled.img`
  width: 50%;
  object-fit: contain;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 80%;
  }
`

const StyledLink = styled.a`
  margin-top: 40px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-top: 20px;
  }
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
        <StyledDesc>
          <ContentMedium>{t('mint.hero.desc')}</ContentMedium>
        </StyledDesc>
        <StyledPink>
          <ContentMedium>{t('mint.hero.limit')}</ContentMedium>
        </StyledPink>
        <StyledLink href={WHITE_PAPER_LINK} target="_blank">
          <Button primaryColor="white" Typography={Headline}>
            {t('mint.hero.whitepaper')}
          </Button>
        </StyledLink>
      </StyledContainer>
      <StyledHeroImage src={heroImg} />
    </StyledHero>
  )
}
