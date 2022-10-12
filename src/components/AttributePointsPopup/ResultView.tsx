import Button from 'components/Button'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, Headline } from 'styles/typography'
import arrowImage from './arrow.png'
import OttoCard from './OttoCard'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledOttos = styled.div`
  display: flex;
  align-items: center;
`

const StyledArrow = styled.div`
  width: ${arrowImage.width / 2}px;
  height: ${arrowImage.height / 2}px;
  background: center / cover url(${arrowImage.src});
`

export interface ResultViewProps {
  result: {
    otto: Otto
    points: { [k: string]: number }
  }
  onRequestClose: () => void
}

export default function ResultView({ result: { otto, points }, onRequestClose }: ResultViewProps) {
  const { t } = useTranslation('', { keyPrefix: 'attributePoints' })
  console.log(points)

  return (
    <StyledContainer>
      <ContentLarge as="h3">{t('resultTitle')}</ContentLarge>
      <Caption>{t('resultDesc')}</Caption>
      <StyledOttos>
        <OttoCard otto={otto} />
        <StyledArrow />
        <OttoCard otto={otto} points={points} />
      </StyledOttos>
      <Button width="100%" Typography={Headline} primaryColor="white" onClick={onRequestClose}>
        {t('resultCloseButton')}
      </Button>
    </StyledContainer>
  )
}
