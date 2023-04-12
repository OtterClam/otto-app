import OttoImage from 'components/OttoImage'
import { MAX_OTTOS_PER_LOCATION } from 'constant'
import { useAdventureLocation } from 'contexts/AdventureLocations'
import { AdventurePopupStep, AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import useAdventureOttosAtLocation from 'hooks/useAdventureOttosAtLocation'
import { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import Image from 'next/image'
import { useCallback } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { useOtto } from 'contexts/Otto'
import AdventureRibbonText from '../AdventureRibbonText'

const WIDTH = 134
const HEIGHT = 150

const StyledContainer = styled.button<{ left: number; top: number }>`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  z-index: 0;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  transform: translate(-${WIDTH / 2}px, -${HEIGHT / 2}px);
  background: transparent;
  outline: none;
`

const StyledPinImageContainer = styled.div<{ locked: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: -1;
  width: 120px;
  height: 120px;
  transform: translateX(-60px);

  ${({ locked }) =>
    locked &&
    `
    &::before {
      content: '';
      position: absolute;
      background: center / cover url(/images/adventure/chain.png);
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  `}
`

const StyledDetails = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  box-sizing: border-box;
  padding-top: 90px;
`

const StyledPinImage = styled(Image).attrs({ layout: 'fill' })``

const StyledOttoImageContainer = styled.div`
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 4px;
  background: rgba(16, 22, 49, 0.5);
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  overflow: hidden;
`

const StyledOttoImages = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
  margin-bottom: -2px;
`

const StyledAdventureTime = styled(Note)`
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 3px;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  background: ${({ theme }) => theme.colors.lightGray200};
`

const StyledRequiredLevel = styled(Note)<{ locked: boolean }>`
  position: absolute;
  right: 3px;
  top: 70px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 3px;
  padding: 0 5px;

  ${({ locked }) =>
    locked &&
    `
    &::before {
      content: '';
      background: url(/images/adventure/lock.svg);
      width: 18px;
      height: 18px;
    }
  `}
`

const formatAdventureTime = (adventureTime: Duration) => {
  const h = adventureTime.hours && `${adventureTime.hours}h`
  const m = adventureTime.minutes && `${adventureTime.minutes}m`
  const s = adventureTime.seconds && `${adventureTime.seconds}s`
  return [h, m, s].filter(Boolean).join(' ')
}

export interface AdventureLocationProps {
  className?: string
  id: number
  ottoLocked?: boolean
}

export default function AdventureLocation({ id, className, ottoLocked = false }: AdventureLocationProps) {
  const { dispatch } = useAdventureUIState()
  const location = useAdventureLocation(id)
  const { ottos: allOttos } = useMyOttos()
  const { setOtto, otto } = useOtto()
  const ottos = useAdventureOttosAtLocation(id)
  const buttonLocked = ottoLocked && (otto?.level ?? 0) < (location?.minLevel ?? 0)
  const locked =
    !location?.open ||
    !allOttos.find(
      otto => location && otto.level >= location.minLevel && otto.adventureStatus === AdventureOttoStatus.Ready
    ) ||
    ottos.filter(otto => otto.adventureStatus === AdventureOttoStatus.Ongoing).length >= 5 ||
    buttonLocked
  const top = (location?.mapPositionY ?? 0) * 100
  const left = (location?.mapPositionX ?? 0) * 100

  const openPopup = useCallback(() => {
    if (!ottoLocked) {
      setOtto(undefined, false)
    }
    dispatch({
      type: AdventureUIActionType.OpenPopup,
      data: {
        locationId: id,
        popupStep: AdventurePopupStep.LocationInfo,
      },
    })
  }, [dispatch, id, ottoLocked, setOtto])

  return (
    <StyledContainer disabled={buttonLocked} onClick={openPopup} top={top} left={left} className={className}>
      {location && (
        <>
          <StyledPinImageContainer locked={locked}>
            <StyledPinImage unoptimized src={location.image} />
          </StyledPinImageContainer>

          <StyledRequiredLevel locked={locked}>LV {location.minLevel}</StyledRequiredLevel>

          <StyledDetails>
            <StyledOttoImages>
              {ottos.map(otto => (
                <StyledOttoImageContainer key={otto.id}>
                  <OttoImage unoptimized src={otto.image} size={22} />
                </StyledOttoImageContainer>
              ))}
              {' '
                .repeat(MAX_OTTOS_PER_LOCATION - ottos.length)
                .split('')
                .map((_, i) => (
                  <StyledOttoImageContainer key={`empty-${i}`} />
                ))}
            </StyledOttoImages>

            <AdventureRibbonText>{location.name}</AdventureRibbonText>

            <StyledAdventureTime>{formatAdventureTime(location.adventureTime)}</StyledAdventureTime>
          </StyledDetails>
        </>
      )}
    </StyledContainer>
  )
}
