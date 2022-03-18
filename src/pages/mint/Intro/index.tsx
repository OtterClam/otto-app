import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ContentSmall, Display2, Headline } from 'styles/typography'
import Step1Img from './step1.png'
import Step2Img from './step2.png'
import Step2ExtraImg from './step2-extra.png'
import Step3Img from './step3.png'
import Step4Img from './step4.png'
import LimitedTreasuryImg from './limited-treasury.jpeg'

const StyledIntro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 80px;
`

const StyledLimitedTreasury = styled.img`
  width: 100%;
  border-radius: 8px;
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

const StyledExtraImage = styled.img`
  width: 568px;
  object-fit: contain;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

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
        image: Step1Img,
      },
      {
        step: t('mint.intro.step2'),
        title: t('mint.intro.step2_title'),
        desc: t('mint.intro.step2_desc'),
        extra: Step2ExtraImg,
        image: Step2Img,
      },
      {
        step: t('mint.intro.step3'),
        title: t('mint.intro.step3_title'),
        desc: t('mint.intro.step3_desc'),
        image: Step3Img,
      },
      {
        step: t('mint.intro.step4'),
        title: t('mint.intro.step4_title'),
        desc: t('mint.intro.step4_desc'),
        image: Step4Img,
      },
    ],
    [t]
  )
  return (
    <StyledIntro>
      <StyledLimitedTreasury src={LimitedTreasuryImg} alt="Limited Treasury" />
      <StyledTitle>
        <Display2>{t('mint.intro.title')}</Display2>
      </StyledTitle>
      {sections.map(({ step, title, desc, extra, image }, index) => (
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
            {extra && <StyledExtraImage src={extra} />}
          </StyledStepTextContainer>
          <StyledStepImage src={image} />
        </StyledStepSection>
      ))}
    </StyledIntro>
  )
}
