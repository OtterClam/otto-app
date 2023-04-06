import { AdventurePopupStep, useAdventureUIState, useOpenAdventurePopup } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import useRemainingTime from 'hooks/useRemainingTime'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useCallback } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import AdventureInfoSection from './AdventureInfoSection'

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

function ListItem({ otto, onClick }: { otto: Otto; onClick: (ottoId: string) => void }) {
  const { t } = useTranslation('', { keyPrefix: 'ongoingOttos' })
  const duration = useRemainingTime(otto.latestAdventurePass?.canFinishAt ?? new Date())

  return (
    <StyledListItem>
      <StyledImageContainer>
        <Image layout="fill" width={25} height={25} src={otto.image} />
      </StyledImageContainer>
      <StyledName>{otto.name}</StyledName>
      <StyledDuration>{duration}</StyledDuration>
      <StyledViewButton onClick={() => onClick(otto.id)}>{t('view')}</StyledViewButton>
    </StyledListItem>
  )
}

interface Props {
  ongoingOttos: Otto[]
}

export default function AdventureOngoingOttos({ ongoingOttos }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'ongoingOttos' })

  const {
    state: { selectedLocationId },
  } = useAdventureUIState()
  const openPopup = useOpenAdventurePopup()
  const { setOtto } = useOtto()
  const viewOtto = useCallback(
    (ottoId: string) => {
      const otto = ongoingOttos.find(({ id }) => id === ottoId)
      setOtto(otto)
      openPopup(selectedLocationId, AdventurePopupStep.Exploring)
    },
    [selectedLocationId, ongoingOttos, openPopup, setOtto]
  )

  return (
    <AdventureInfoSection title={t('title')}>
      {ongoingOttos.length === 0 && <StyledNoOtto>{t('noOtto')}</StyledNoOtto>}
      {ongoingOttos.length > 0 && (
        <StyledList>
          {ongoingOttos.map(otto => (
            <ListItem key={otto.id} otto={otto} onClick={viewOtto} />
          ))}
        </StyledList>
      )}
    </AdventureInfoSection>
  )
}
