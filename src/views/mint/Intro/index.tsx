import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Display2, Headline } from 'styles/typography'
import Step1Img from './step1.png'
import Step2Img from './step2.png'
import Step3Img from './step3.png'

const StyledIntro = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 80px;
  color: #fff;
`

const StyledTitle = styled.p`
  margin-top: 80px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-top: 40px;
  }
`

const StyledStepSection = styled.section`
  display: flex;
  align-items: flex-start;
  padding: 40px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray300};
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    gap: 16px;
  }
`

const StyledStep = styled.p`
  color: ${props => props.theme.colors.clamPink};
`

const StyledStepTextContainer = styled.p``

const StyledParagraph = styled.p``

const StyledStepImage = styled.img`
  width: 320px;
  object-fit: contain;
`

export default function Intro() {
  const { t } = useTranslation()
  const sections = useMemo(
    () => [
      {
        step: t('mint.intro.step1'),
        title: t('mint.intro.step1_title'),
        desc: t('mint.intro.step1_desc'),
        image: Step1Img.src,
      },
      {
        step: t('mint.intro.step2'),
        title: t('mint.intro.step2_title'),
        desc: t('mint.intro.step2_desc'),
        image: Step2Img.src,
      },
      {
        step: t('mint.intro.step3'),
        title: t('mint.intro.step3_title'),
        desc: t('mint.intro.step3_desc'),
        image: Step3Img.src,
      },
    ],
    [t]
  )
  return (
    <StyledIntro>
      <StyledTitle>
        <Display2>{t('mint.intro.title')}</Display2>
      </StyledTitle>
      {sections.map(({ step, title, desc, image }, index) => (
        <StyledStepSection key={index}>
          <StyledStepTextContainer>
            <StyledStep>
              <Headline>{step}</Headline>
            </StyledStep>
            <StyledParagraph>
              <Headline>{title}</Headline>
            </StyledParagraph>
            <StyledParagraph>
              <ContentSmall>{desc}</ContentSmall>
            </StyledParagraph>
          </StyledStepTextContainer>
          <StyledStepImage src={image} />
        </StyledStepSection>
      ))}
    </StyledIntro>
  )
}
