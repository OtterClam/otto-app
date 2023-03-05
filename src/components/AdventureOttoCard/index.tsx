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
  margin-bottom: 8px;
  background: ${({ theme, disabled, bg }) =>
    bg ? `center / cover url(${bg})` : (disabled ? theme.colors.lightGray400 : theme.colors.white)};
  background-position-y: -160px;
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  outline: none;
  text-align: left;
  min-width: 0px;
  overflow: hidden;
`

const StyledDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: space-between;
  width:100%;
`

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledRightColumn = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-right;
  flex-direction: column;
  StyledRow{

  }
`
const StyledRow = styled.div`
  align-self: flex-end;
  button, a div{
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
  padding: 3px 5px 1px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  white-space: nowrap;
`

const StyledName = styled(Caption)`
  display: inline-flex;
  padding: 3px 5px 1px;
  margin: 0 5px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.lightGray200};
  white-space: nowrap;
`

const StyledLocationContainer = styled.div`
  display: flex;
  align-self: flex-start;
  gap: 5px;
  flex-wrap: wrap;
  margin: 4px 4px 0 0;
`

const StyledLocation = styled(Caption)`
  display: inline-flex;
  padding: 0 5px;
  gap: 4px;
  white-space: nowrap;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.lightGray200};
`

const StyledAdventureStatus = styled.span`
  span{
    display: flex;
    width: 90px;
    justify-content: space-around;
    margin: 0 0 6px;
  }
`

const StyledRemainingTime = styled(RemainingTime)`
  width: 80px;
`

const StyledJournalButton = styled.div`
  display:flex;
  width: 90px;
  justify-content: space-around;
  border-radius: 4px;
  background-image: url("/trait-icons/Mission Item.png");
  background-size: contain;
  background-repeat: no-repeat;
  padding: 2px 0 2px 25px;
  background-position: left;
  margin-top:-4px;
`

const StyledAdventureText = styled(Caption).attrs({ as: 'div' })`
  display: flex;
  justify-content: space-between;
  padding: 7px 14px 5px 14px;
  color: ${({ theme }) => theme.colors.darkGray300};
  background: ${({ theme }) => theme.colors.lightGray200};
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
  opacity: 0.9;
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
    <StyledAdventureOttoCard disabled={otto.adventureStatus === AdventureOttoStatus.Unavailable} bg={location && location.bgImage ? location.bgImage : ''}>
      <StyledContainer>
        <StyledDetails>
          <StyledColumn>
            <StyledAvatarContainer size={80}>
              <OttoImage unoptimized size={80} src={otto.image} />
            </StyledAvatarContainer>
          </StyledColumn>
          <StyledColumn>
            <StyledRow>
              <StyledLevel>LV {otto.level}</StyledLevel>
              <StyledName>{otto.name}</StyledName>
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
              {otto.adventureStatus === AdventureOttoStatus.Resting && otto.restingUntil && (
                <a onClick={onClick}>
                  <StyledRemainingTime target={otto.restingUntil} />
                </a>
              )}
              {otto.adventureStatus === AdventureOttoStatus.Ongoing &&
              otto.latestAdventurePass?.canFinishAt !== undefined && (
                <a onClick={onClick}>
                  <StyledRemainingTime target={otto.latestAdventurePass?.canFinishAt} />
                </a>
              )}
            </StyledRow>
          </StyledRightColumn>
        </StyledDetails>
      </StyledContainer>
        {otto.adventureStatus === AdventureOttoStatus.Finished && (
          <StyledAdventureText />
        )}
        {otto.adventureStatus === AdventureOttoStatus.Ongoing && (
          <StyledAdventureText>
            <span>{t('ongoing', { name: otto.name, location: location?.name })}</span>
          </StyledAdventureText>
        )}
        {otto.adventureStatus === AdventureOttoStatus.Ready && (
          <StyledAdventureText>
            <span>{t('ready', { name: otto.name })}</span>
            <ContentSmall  onClick={goToJournal}>
              <StyledJournalButton>
                <a>{t('journal')}</a>
              </StyledJournalButton>
            </ContentSmall>
          </StyledAdventureText>
        )}
        {otto.adventureStatus === AdventureOttoStatus.Resting && (
          <StyledAdventureText>
            <span>{t('resting_1', { name: otto.name })}</span>
            <ContentSmall onClick={goToJournal}>
              <StyledJournalButton>
                <a>{t('journal')}</a>
              </StyledJournalButton>
            </ContentSmall>
          </StyledAdventureText>
        )}
    </StyledAdventureOttoCard>
  )
}, isEqual)
