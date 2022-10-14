/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import AdventureStatus from 'components/AdventureStatus'
import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import { useAdventureLocation } from 'contexts/AdventureLocations'
import { AdventurePopupStep, useGoToAdventureResultStep, useOpenAdventurePopup } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import useTimer from 'hooks/useTimer'
import isEqual from 'lodash/isEqual'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { memo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, ContentMedium } from 'styles/typography'
import RemainingTime from './RemainingTime'

const StyledAdventureOttoCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
`

const StyledContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray400 : theme.colors.white)};
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

const StyledAdventureStatus = styled(Caption).attrs({ as: 'div' })`
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.darkGray300};
  background: ${({ theme }) => theme.colors.lightGray200};
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
`

export interface AdventureOttoCardProps {
  otto: Otto
}

export default memo(function AdventureOttoCard({ otto }: AdventureOttoCardProps) {
  const location = useAdventureLocation(otto.currentLocationId)
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoCard' })
  const { setOtto } = useOtto()
  const openPopup = useOpenAdventurePopup()
  const goToAdventureResultStep = useGoToAdventureResultStep()

  const check = () => {
    if (location) {
      setOtto(otto)
      openPopup(location.id, AdventurePopupStep.Exploring)
    }
  }

  const go = () => {
    setOtto(otto)
    openPopup(undefined, AdventurePopupStep.Map)
  }

  const openRestingPopup = () => {
    setOtto(otto)
    openPopup(0, AdventurePopupStep.Resting)
  }

  const [, setTick] = useState(0)

  useTimer(
    () => {
      // reload every 1 seconds
      setTick(tick => tick + 1)
    },
    1000,
    []
  )

  return (
    <StyledAdventureOttoCard>
      <StyledContainer disabled={otto.adventureStatus === AdventureOttoStatus.Unavailable}>
        <StyledAvatarContainer size={50}>
          <StyledAvatar layout="fill" src={otto.image} />
        </StyledAvatarContainer>

        <StyledDetails>
          <StyledName>{otto.name}</StyledName>
          <StyledLocationContainer>
            <AdventureStatus status={otto.adventureStatus} />
            {location && (
              <StyledLocation>
                <StyledLocationImage width={21} height={21} src={location.image} />
                {location.name}
              </StyledLocation>
            )}
          </StyledLocationContainer>
        </StyledDetails>

        <StyledAction>
          {otto.adventureStatus === AdventureOttoStatus.Finished && (
            <Button onClick={check} Typography={ContentMedium} primaryColor="white" padding="3px 10px">
              {t('checkOtto')}
            </Button>
          )}

          {otto.adventureStatus === AdventureOttoStatus.Ready && (
            <Button onClick={go} Typography={ContentMedium} primaryColor="white" padding="3px 10px">
              {t('go')}
            </Button>
          )}

          {otto.adventureStatus === AdventureOttoStatus.Resting && otto.restingUntil && (
            <RemainingTime onClick={openRestingPopup} target={otto.restingUntil} />
          )}

          {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
            otto.latestAdventurePass?.canFinishAt !== undefined && (
              <RemainingTime onClick={check} target={otto.latestAdventurePass?.canFinishAt} />
            )}
        </StyledAction>
      </StyledContainer>
      <StyledAdventureStatus>
        {otto.adventureStatus === AdventureOttoStatus.Ready && (
          <>
            {t('ready', { name: otto.name })}
            {otto.latestAdventurePass && (
              <div>
                <a
                  onClick={() => {
                    setOtto(otto)
                    otto.latestAdventurePass &&
                      otto.latestAdventurePass?.finishedTx &&
                      goToAdventureResultStep({
                        tx: otto.latestAdventurePass.finishedTx,
                        locationId: otto.latestAdventurePass.locationId,
                      })
                  }}
                >
                  {t('resting_2')}
                </a>
              </div>
            )}
          </>
        )}

        {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
          t('ongoing', { name: otto.name, location: location?.name })}
        {otto.adventureStatus === AdventureOttoStatus.Resting && (
          <>
            {t('resting_1', { name: otto.name })}
            <a
              onClick={() => {
                setOtto(otto)
                otto.latestAdventurePass &&
                  otto.latestAdventurePass?.finishedTx &&
                  goToAdventureResultStep({
                    tx: otto.latestAdventurePass.finishedTx,
                    locationId: otto.latestAdventurePass.locationId,
                  })
              }}
            >
              {t('resting_2')}
            </a>
          </>
        )}
      </StyledAdventureStatus>
    </StyledAdventureOttoCard>
  )
}, isEqual)
