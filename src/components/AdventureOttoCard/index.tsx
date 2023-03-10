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

interface AdventureOttoCardProps {
  bg?: string
  adventureStatus?: AdventureOttoStatus
  otto: Otto
}

const StyledAdventureOttoCard = styled.div<AdventureOttoCardProps>`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
  margin-bottom: 8px;
  background: ${({ theme, bg }) => (bg ? `center / cover url(${bg})` : theme.colors.white)};
  background-position-y: 70%;
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 14px;
  outline: none;
  text-align: left;
  min-width: 0px;
  overflow: hidden;
  background-color: rgba(245, 234, 228, 0.75);
`

const StyledDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  justify-content: flex-start;
  width: 100%;
`

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: min-content;
`

const StyledRightColumn = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  flex-direction: column;
`

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  button,
  a div {
    min-width: 90px;
  }
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

const StyledLevel = styled(Caption)`
  display: inline-flex;
  margin: 1px 0 -1px;
  padding: 3px 5px 1px;
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  white-space: nowrap;
`

const StyledName = styled(Caption)<AdventureOttoCardProps>`
  display: inline-flex;
  padding: 3px 7px 1px;
  margin: 0 5px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ adventureStatus, theme }) =>
    adventureStatus === AdventureOttoStatus.Ongoing || adventureStatus === AdventureOttoStatus.Finished
      ? theme.colors.lightGray200
      : 'none'};
  white-space: nowrap;
`

const StyledLocationContainer = styled.div`
  display: flex;
  align-self: flex-start;
  gap: 5px;
  flex-wrap: wrap;
  margin: 5px 4px 0 0;
`

const StyledLocation = styled(Caption)`
  display: inline-flex;
  padding: 3px 7px 2px 2px;
  gap: 4px;
  white-space: nowrap;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.lightGray200};
`

const StyledAdventureStatus = styled.span`
  span {
    display: flex;
    width: 90px;
    justify-content: space-around;
    margin: 0 0 6px;
  }
`

const StyledRemainingTime = styled(RemainingTime)`
  width: 80px;
  p,
  p::after {
    margin-top: 2px;
  }
`

const StyledJournalButton = styled.div`
  display: flex;
  width: 87px;
  justify-content: space-around;
  border-radius: 4px;
  background: url('/trait-icons/Mission Item.png') left/contain no-repeat;
  padding-left: 20px;
  margin-top: -3px;
`

const StyledAdventureText = styled(Caption).attrs({ as: 'div' })`
  display: flex;
  justify-content: space-between;
  padding: 7px 14px 5px 14px;
  color: ${({ theme }) => theme.colors.darkGray300};
  background-color: rgba(255, 255, 255, 0.9);
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
`

export default memo(function AdventureOttoCard({ bg, adventureStatus, otto }: AdventureOttoCardProps) {
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
    if (otto.latestAdventurePass?.finishedTx) {
      goToAdventureResultStep({
        ottoId: otto.id,
        tx: otto.latestAdventurePass.finishedTx,
        locationId: otto.latestAdventurePass.locationId,
        showEvent: false,
      })
    }
  }

  const openPopupWithStep = (step: AdventurePopupStep) => {
    setOtto(otto)
    const locationId = step === AdventurePopupStep.Resting ? 0 : undefined
    openPopup(locationId, step)
  }

  const onClick = () => {
    switch (otto.adventureStatus) {
      case AdventureOttoStatus.Finished:
        check()
        break
      case AdventureOttoStatus.Ready:
        openPopupWithStep(AdventurePopupStep.Map)
        break
      case AdventureOttoStatus.Resting:
        if (otto.restingUntil) {
          openPopupWithStep(AdventurePopupStep.Resting)
        }
        break
      case AdventureOttoStatus.Ongoing:
        if (otto.latestAdventurePass?.canFinishAt !== undefined) {
          check()
        }
        break
      default:
        break
    }
  }

  const adventureTexts = {
    [AdventureOttoStatus.Finished]: t('finished', { name: otto.name, location: location?.name }),
    [AdventureOttoStatus.Ongoing]: t('ongoing', { name: otto.name, location: location?.name }),
    [AdventureOttoStatus.Ready]: t('ready', { name: otto.name }),
    [AdventureOttoStatus.Resting]: t('resting_1', { name: otto.name }),
  }

  const showJournalButton = [AdventureOttoStatus.Ready, AdventureOttoStatus.Resting].includes(otto.adventureStatus)

  return (
    <StyledAdventureOttoCard
      bg={location && location.bgImage ? location.bgImage : ''}
      adventureStatus={otto.adventureStatus}
      otto={otto}
    >
      <StyledContainer>
        <StyledDetails>
          <StyledColumn>
            <StyledAvatarContainer size={70}>
              <OttoImage unoptimized size={70} src={otto.image} />
            </StyledAvatarContainer>
          </StyledColumn>
          <StyledColumn>
            <StyledRow>
              <StyledLevel>LV {otto.level}</StyledLevel>
              <StyledName
                bg={location && location.bgImage ? location.bgImage : ''}
                adventureStatus={otto.adventureStatus}
                otto={otto}
              >
                {otto.name}
              </StyledName>
            </StyledRow>
            <StyledLocationContainer>
              {location && (
                <StyledLocation>
                  <Image unoptimized width={21} height={21} src={location.image} />
                  {location.name}
                </StyledLocation>
              )}
            </StyledLocationContainer>
          </StyledColumn>
          <StyledRightColumn>
            <StyledRow>
              <StyledAdventureStatus>
                <AdventureStatus status={otto.adventureStatus} />
              </StyledAdventureStatus>
            </StyledRow>
            <StyledRow>
              {otto.adventureStatus === AdventureOttoStatus.Finished && (
                <Button Typography={ContentMedium} primaryColor="white" padding="3px 10px" onClick={onClick}>
                  {t('checkOtto')}
                </Button>
              )}
              {otto.adventureStatus === AdventureOttoStatus.Ready && (
                <Button Typography={ContentSmall} primaryColor="white" padding="3px 10px" onClick={onClick}>
                  {t('go')}
                </Button>
              )}
              {(otto.adventureStatus === AdventureOttoStatus.Resting ||
                (otto.adventureStatus === AdventureOttoStatus.Ongoing &&
                  otto.latestAdventurePass?.canFinishAt !== undefined)) && (
                <a onClick={onClick}>
                  <StyledRemainingTime
                    target={
                      otto.adventureStatus === AdventureOttoStatus.Resting
                        ? otto.restingUntil ?? new Date()
                        : otto.latestAdventurePass?.canFinishAt ?? new Date()
                    }
                  />
                </a>
              )}
            </StyledRow>
          </StyledRightColumn>
        </StyledDetails>
      </StyledContainer>
      <StyledAdventureText>
        {otto.adventureStatus !== AdventureOttoStatus.Unavailable && (
          <span>{adventureTexts[otto.adventureStatus]}</span>
        )}
        {showJournalButton && (
          <ContentSmall onClick={goToJournal}>
            <StyledJournalButton>
              <a>{t('results')}</a>
            </StyledJournalButton>
          </ContentSmall>
        )}
      </StyledAdventureText>
    </StyledAdventureOttoCard>
  )
}, isEqual)
