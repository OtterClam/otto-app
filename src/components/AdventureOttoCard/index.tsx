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
import { Caption, ContentExtraSmall, ContentSmall, ContentMedium, Note } from 'styles/typography'
import RemainingTime from './RemainingTime'

const StyledAdventureOttoCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray400 : theme.colors.white)};
  padding: 14px;
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
  padding: 5px 14px;
  color: ${({ theme }) => theme.colors.darkGray300};
  background: ${({ theme }) => theme.colors.lightGray200};
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
`

const StyledLevel = styled(Note)`
  display: inline-block;
  padding: 3px 5px 0;
  margin-top: -3px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  white-space: nowrap;
`

const StyledRemainingTime = styled(RemainingTime)`
  width: 80px;
`

const StyledAdventureButtons = styled.div`
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-gap: 8px;
  button, span {
    white-space:nowrap;
  }
`

const StyledJournalButton = styled.div`
  background-image: url("/trait-icons/Mission Item.png");
  background-size: contain;
  background-repeat: no-repeat;
  padding: 0 0 0 25px;
  background-position: left;
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

  const goToJournal = () => {
    setOtto(otto)
    otto.latestAdventurePass && otto.latestAdventurePass?.finishedTx &&
      goToAdventureResultStep({
        ottoId: otto.id,
        tx: otto.latestAdventurePass.finishedTx,
        locationId: otto.latestAdventurePass.locationId,
        showEvent: false,
      })
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
      <StyledContainer disabled={otto.adventureStatus === AdventureOttoStatus.Unavailable}>
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

        {otto.adventureStatus === AdventureOttoStatus.Finished && (
          <Button Typography={ContentMedium} primaryColor="white" padding="3px 10px" onClick={onClick}>
            {t('checkOtto')}
          </Button>
          )
        }

        {otto.adventureStatus === AdventureOttoStatus.Ready && (
          <StyledAdventureButtons>
            <Button Typography={ContentSmall} primaryColor="white" padding="3px 10px 3px 6px" onClick={goToJournal}>
              <StyledJournalButton>
                {t('journal')}
              </StyledJournalButton>
            </Button>
            <Button Typography={ContentSmall} primaryColor="white" padding="3px 10px" onClick={onClick}>
              {t('go')}
            </Button>
          </StyledAdventureButtons>
          )
        }

        {otto.adventureStatus === AdventureOttoStatus.Resting && otto.restingUntil && (
          <StyledAdventureButtons>
            <Button Typography={ContentSmall} primaryColor="white" padding="3px 10px 3px 6px" onClick={goToJournal}>
              <StyledJournalButton>
                {t('journal')}
              </StyledJournalButton>
            </Button>
            <a onClick={onClick}>
              <StyledRemainingTime target={otto.restingUntil} />
            </a>
          </StyledAdventureButtons>
          )
        }

        {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
          otto.latestAdventurePass?.canFinishAt !== undefined && (
            <a onClick={onClick}>
              <StyledRemainingTime target={otto.latestAdventurePass?.canFinishAt} />
            </a>
          )
        }
        
      </StyledContainer>
      <StyledAdventureStatus>
        {otto.adventureStatus === AdventureOttoStatus.Ready && (
          t('ready', { name: otto.name })
        )}

        {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
          t('ongoing', { name: otto.name, location: location?.name }
        )}
        {otto.adventureStatus === AdventureOttoStatus.Resting && (
          t('resting_1', { name: otto.name })
        )}
      </StyledAdventureStatus>
    </StyledAdventureOttoCard>
  )
}, isEqual)
