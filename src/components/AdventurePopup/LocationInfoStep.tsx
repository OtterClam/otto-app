import AdventureConditionalBoosts from 'components/AdventureConditionalBoosts'
import AdventureLocationName from 'components/AdventureLocationName'
import AdventureOngoingOttos from 'components/AdventureOngoingOttos'
import AdventureRewards from 'components/AdventureRewards'
import Button from 'components/Button'
import { MAX_OTTOS_PER_LOCATION } from 'constant'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import {
  AdventurePopupStep,
  AdventureUIActionType,
  useAdventureUIState,
  useSelectedAdventureLocation,
} from 'contexts/AdventureUIState'
import useAdventureOttosAtLocation from 'hooks/useAdventureOttosAtLocation'
import { AdventureOttoStatus } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
  }
`
const StyledHead = styled.div<{ bg: string }>`
  position: relative;
  flex: 1 50%;
  background: center / cover url(${({ bg }) => bg});

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 0 114px;
    min-height: 114px;
    max-height: 114px;
  }
`

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 50%;
  background: ${({ theme }) => theme.colors.otterBlack};
  padding: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px;
  }
`

const StyledName = styled(AdventureLocationName)`
  position: absolute;
  top: 10px;
  left: -2px;
  z-index: 1;
`

const StyledImageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 192px;
  height: 192px;
  transform: translate(-96px, -96px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 50%;
    right: 30px;
    left: unset;
    width: 100px;
    height: 100px;
    transform: translate(0, -50px);
  }
`

export function LocationInfoStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocationPopup' })
  const { dispatch } = useAdventureUIState()
  const location = useSelectedAdventureLocation()
  const ottos = useAdventureOttosAtLocation(location?.id)
  const ongoingOttos = useMemo(
    () => ottos.filter(otto => otto.adventureStatus === AdventureOttoStatus.Ongoing),
    [ottos]
  )
  const preview = () => {
    dispatch({ type: AdventureUIActionType.SetPopupStep, data: AdventurePopupStep.PreviewOtto })
  }
  return (
    <StyledContainer>
      {location && (
        <AdventureLocationProvider location={location}>
          <StyledHead bg={location.bgImage}>
            <StyledName location={location} />
            <StyledImageWrapper>
              <Image layout="fill" src={location.image} unoptimized />
            </StyledImageWrapper>
          </StyledHead>
          <StyledDetails>
            <AdventureRewards />
            <AdventureConditionalBoosts noPreview locationBoostsOnly />
            <AdventureOngoingOttos ongoingOttos={ongoingOttos} />
            <Button
              padding="3px 0"
              Typography={Headline}
              onClick={preview}
              disabled={ongoingOttos.length === MAX_OTTOS_PER_LOCATION}
            >
              {t(ongoingOttos.length === MAX_OTTOS_PER_LOCATION ? 'too_crowed' : 'nextStep')}
            </Button>
          </StyledDetails>
        </AdventureLocationProvider>
      )}
    </StyledContainer>
  )
}
