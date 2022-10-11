import { useAdventureUIState } from 'contexts/AdventureUIState'
import useAdventureOttosAtLocation from 'hooks/useAdventureOttosAtLocation'
import useRemainingTime from 'hooks/useRemainingTime'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import AdventureInfoSection from './AdventureInfoSection'
import CroppedImage from './CroppedImage'

const StyledListItem = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledImageContainer = styled.div`
  flex: 0 24px;
  min-width: 24px;
  max-width: 24px;
  height: 24px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  position: relative;
  overflow: hidden;
`

const StyledImage = styled(CroppedImage).attrs({ layout: 'fill' })``

const StyledName = styled(Note)`
  flex: 1;
  color: ${({ theme }) => theme.colors.white};
`

const StyledDuration = styled(Note)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  padding: 0 10px;
  height: 24px;
`

const StyledViewButton = styled.button`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.crownYellow};
  border-radius: 5px;
  padding: 0 10px;
  height: 24px;
`

const StyledList = styled.div`
  padding: 10px;
`

const StyledNoOtto = styled(Note).attrs({ as: 'div' })`
  text-align: center;
  padding: 10px;
`

function ListItem({ otto }: { otto: Otto }) {
  const { t } = useTranslation('', { keyPrefix: 'ongoingOttos' })
  const duration = useRemainingTime(otto.latestAdventurePass?.canFinishedAt ?? new Date())

  return (
    <StyledListItem>
      <StyledImageContainer>
        <StyledImage src={otto.image} />
      </StyledImageContainer>
      <StyledName>{otto.name}</StyledName>
      <StyledDuration>{duration}</StyledDuration>
      <StyledViewButton>{t('view')}</StyledViewButton>
    </StyledListItem>
  )
}

export default function AdventureOngoingOttos() {
  const { t } = useTranslation('', { keyPrefix: 'ongoingOttos' })
  const {
    state: { selectedLocationId },
  } = useAdventureUIState()
  const ottos = useAdventureOttosAtLocation(selectedLocationId)
  const ongoingOttos = useMemo(
    () => ottos.filter(otto => otto.adventureStatus === AdventureOttoStatus.Ongoing),
    [ottos]
  )

  return (
    <AdventureInfoSection title={t('title')}>
      {ongoingOttos.length === 0 && <StyledNoOtto>{t('noOtto')}</StyledNoOtto>}
      {ongoingOttos.length > 0 && (
        <StyledList>
          {ongoingOttos.map(otto => (
            <ListItem key={otto.id} otto={otto} />
          ))}
        </StyledList>
      )}
    </AdventureInfoSection>
  )
}
