import { Step } from 'components/AdventurePopup'
import AdventureStatus from 'components/AdventureStatus'
import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import { useAdventureLocation } from 'contexts/AdventureLocations'
import { useAdventureUIState, useGoToAdventurePopupStep, useOpenAdventurePopup } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import isEqual from 'lodash/isEqual'
import { AdventureOtto, AdventureOttoStatus } from 'models/AdventureOtto'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { memo } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, ContentMedium } from 'styles/typography'
import RemainingTime from './RemainingTime'

const StyledContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray400 : theme.colors.white)};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 17px 20px;
`

const StyledDetails = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledAction = styled.div`
  flex: 1;
  white-space: nowrap;
`

const StyledName = styled(ContentExtraSmall)``

const StyledLocationContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledLocation = styled(Caption)`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledLocationImage = styled(CroppedImage)``

const StyledAvatarContainer = styled.div<{ size: number }>`
  position: relative;
  flex: 0 ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  max-width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
`

const StyledAvatar = styled(CroppedImage)``

export interface AdventureOttoCardProps {
  otto: AdventureOtto
}

export default memo(function AdventureOttoCard({ otto }: AdventureOttoCardProps) {
  const location = useAdventureLocation(otto.locationId)
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoCard' })
  const { setOtto } = useOtto()
  const { ottos } = useMyOttos()
  const openPopup = useOpenAdventurePopup()

  const check = () => {
    const myOtto = ottos.find(myOtto => myOtto.tokenId === String(otto.id))
    if (myOtto && location) {
      setOtto(myOtto)
      openPopup(location.id, Step.Exploring)
    }
  }

  return (
    <StyledContainer disabled={otto.status === AdventureOttoStatus.Unavailable}>
      <StyledAvatarContainer size={50}>
        <StyledAvatar layout="fill" src={otto.image} />
      </StyledAvatarContainer>

      <StyledDetails>
        <StyledName>{otto.name}</StyledName>
        <StyledLocationContainer>
          <AdventureStatus status={otto.status} />
          {location && (
            <StyledLocation>
              <StyledLocationImage width={21} height={21} src={location.image} />
              {location.name}
            </StyledLocation>
          )}
        </StyledLocationContainer>
      </StyledDetails>

      <StyledAction>
        {otto.status === AdventureOttoStatus.Finished && (
          <Button onClick={check} Typography={ContentMedium} primaryColor="white" padding="3px 10px">
            {t('checkOtto')}
          </Button>
        )}

        {otto.status === AdventureOttoStatus.Resting && otto.restingUntil !== undefined && (
          <RemainingTime onClick={check} targetDate={otto.restingUntil} />
        )}

        {otto.status === AdventureOttoStatus.Ongoing && otto.canFinishedAt !== undefined && (
          <RemainingTime onClick={check} targetDate={otto.canFinishedAt} />
        )}
      </StyledAction>
    </StyledContainer>
  )
}, isEqual)
