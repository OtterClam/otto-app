/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import AdventureStatus from 'components/AdventureStatus'
import Button from 'components/Button'
import OttoImage from 'components/OttoImage'
import { useAdventureLocation } from 'contexts/AdventureLocations'
import { AdventurePopupStep, useGoToAdventureResultStep, useOpenAdventurePopup } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import isEqual from 'lodash/isEqual'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, ContentMedium, Note } from 'styles/typography'
import RemainingTime from './RemainingTime'

const StyledAdventureOttoCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
`

const StyledContainer = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray400 : theme.colors.white)};
  padding: 17px 20px;
  outline: none;
  text-align: left;
  min-width: 0px;
  overflow: hidden;
`

const StyledDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0px;
`

const StyledAction = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledName = styled(ContentExtraSmall)`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`

const StyledLocationContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
`

const StyledLocation = styled(Caption)`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

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

const StyledAdventureStatus = styled(Caption).attrs({ as: 'div' })`
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.darkGray300};
  background: ${({ theme }) => theme.colors.lightGray200};
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
`

const StyledLevel = styled(Note)`
  display: inline-block;
  padding: 0 5px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  white-space: nowrap;
`

const StyledRemainingTime = styled(RemainingTime)`
  width: 80px;
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
    setOtto(otto, true)
    openPopup(undefined, AdventurePopupStep.Map)
  }

  const openRestingPopup = () => {
    setOtto(otto)
    openPopup(0, AdventurePopupStep.Resting)
  }

  const onClick = () => {
    switch (otto.adventureStatus) {
      case AdventureOttoStatus.Finished:
        check()
        break
      case AdventureOttoStatus.Ready:
        go()
        break
      case AdventureOttoStatus.Resting:
        if (otto.restingUntil) {
          openRestingPopup()
        }
        break
      case AdventureOttoStatus.Ongoing:
        if (otto.latestAdventurePass?.canFinishAt !== undefined) {
          check()
        }
        break
      default:
      // do nothing
    }
  }

  return (
    <StyledAdventureOttoCard>
      <StyledContainer onClick={onClick} disabled={otto.adventureStatus === AdventureOttoStatus.Unavailable}>
        <StyledAvatarContainer size={50}>
          <OttoImage unoptimized size={50} src={otto.image} />
        </StyledAvatarContainer>

        <StyledDetails>
          <div>
            <StyledName>
              <StyledLevel>LV {otto.level}</StyledLevel>
              {otto.name}
            </StyledName>
          </div>
          <StyledLocationContainer>
            <AdventureStatus status={otto.adventureStatus} />
            {location && (
              <StyledLocation>
                <Image unoptimized width={21} height={21} src={location.image} />
                {location.name}
              </StyledLocation>
            )}
          </StyledLocationContainer>
        </StyledDetails>

        <StyledAction>
          {otto.adventureStatus === AdventureOttoStatus.Finished && (
            <Button Typography={ContentMedium} primaryColor="white" padding="3px 10px">
              {t('checkOtto')}
            </Button>
          )}

          {otto.adventureStatus === AdventureOttoStatus.Ready && (
            <Button Typography={ContentMedium} primaryColor="white" padding="3px 10px">
              {t('go')}
            </Button>
          )}

          {otto.adventureStatus === AdventureOttoStatus.Resting && otto.restingUntil && (
            <StyledRemainingTime target={otto.restingUntil} />
          )}

          {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
            otto.latestAdventurePass?.canFinishAt !== undefined && (
              <StyledRemainingTime target={otto.latestAdventurePass?.canFinishAt} />
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
                        ottoId: otto.id,
                        tx: otto.latestAdventurePass.finishedTx,
                        locationId: otto.latestAdventurePass.locationId,
                        showEvent: false,
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
                    ottoId: otto.id,
                    tx: otto.latestAdventurePass.finishedTx,
                    locationId: otto.latestAdventurePass.locationId,
                    showEvent: false,
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
