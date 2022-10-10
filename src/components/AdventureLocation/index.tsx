import { useAdventureLocation } from 'contexts/AdventureLocations'
import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventurePopupStep, AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import useAdventureOttosAtLocation from 'hooks/useAdventureOttosAtLocation'
import { AdventureOttoStatus } from 'models/Otto'
import { useCallback } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import AdventureRibbonText from '../AdventureRibbonText'
import CroppedImage from '../CroppedImage'
import lockImage from './lock.svg'

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

const StyledPinImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: -1;
  width: 120px;
  height: 120px;
  transform: translateX(-60px);
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

const StyledPinImage = styled(CroppedImage).attrs({ layout: 'fill' })``

const StyledOttoImageContainer = styled.div`
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 4px;
  background: rgba(16, 22, 49, 0.5);
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  overflow: hidden;
`

const StyledOttoImage = styled(CroppedImage).attrs({ width: 22, height: 22 })``

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
      background: url(${lockImage.src});
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
}

export default function AdventureLocation({ id, className }: AdventureLocationProps) {
  const { dispatch } = useAdventureUIState()
  const location = useAdventureLocation(id)
  const { ottos: allOttos } = useAdventureOttos()
  const ottos = useAdventureOttosAtLocation(id).slice(0, 5)
  const locked = !allOttos.find(
    otto => location && otto.level >= location.minLevel && otto.adventureStatus === AdventureOttoStatus.Ready
  )
  const top = (location?.mapPositionY ?? 0) * 100
  const left = (location?.mapPositionX ?? 0) * 100

  const openPopup = useCallback(() => {
    dispatch({
      type: AdventureUIActionType.OpenPopup,
      data: {
        locationId: id,
        popupStep: AdventurePopupStep.LocationInfo,
      },
    })
  }, [dispatch, id])

  return (
    <StyledContainer disabled={locked} onClick={openPopup} top={top} left={left} className={className}>
      {location && (
        <>
          <StyledPinImageContainer>
            <StyledPinImage src={location.image} />
          </StyledPinImageContainer>

          <StyledRequiredLevel locked={locked}>LV {location.minLevel}</StyledRequiredLevel>

          <StyledDetails>
            <StyledOttoImages>
              {ottos.map(otto => (
                <StyledOttoImageContainer key={otto.id}>
                  <StyledOttoImage src={otto.image} />
                </StyledOttoImageContainer>
              ))}
              {' '
                .repeat(5 - ottos.length)
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
