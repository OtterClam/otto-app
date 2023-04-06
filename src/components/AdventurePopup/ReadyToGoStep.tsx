import { AdventurePopupStep, useGoToAdventurePopupStep, useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import styled from 'styled-components/macro'
import { ContentLarge, Display1 } from 'styles/typography'

const StyledReadyToGoStep = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 116px 20px 70px 20px;
  color: ${({ theme }) => theme.colors.white};
  gap: 10px;
  background: center / cover url(${({ bg }) => bg});
`

const StyledAvatar = styled.img`
  width: 140px;
  height: 140px;
`

const StyledTitle = styled(Display1).attrs({ as: 'h1' })`
  text-align: center;
`

const StyledDesc = styled(ContentLarge).attrs({ as: 'p' })`
  text-align: center;
`

export default function ReadyToGoStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.readyToGoStep' })
  const { otto } = useOtto()
  const location = useSelectedAdventureLocation()
  const goToStep = useGoToAdventurePopupStep()

  useEffect(() => {
    const timer = setTimeout(() => {
      goToStep(AdventurePopupStep.Exploring)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [goToStep])

  if (!otto || !location) {
    return <div />
  }

  return (
    <StyledReadyToGoStep bg={location.bgImageBlack}>
      <StyledAvatar src={otto.image} alt={otto.name} />
      <StyledTitle>{t('title')}</StyledTitle>
      <StyledDesc>{t('desc', { name: otto.name })}</StyledDesc>
    </StyledReadyToGoStep>
  )
}
