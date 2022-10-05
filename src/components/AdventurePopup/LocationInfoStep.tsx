import AdventureRewards from 'components/AdventureRewards'
import CroppedImage from 'components/CroppedImage'
import { AdventureUIActionType, useAdventureUIState, useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import AdventureConditionalBoosts from 'components/AdventureConditionalBoosts'
import AdventureOngoingOttos from 'components/AdventureOngoingOttos'
import Button from 'components/Button'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import AdventureLocationName from 'components/AdventureLocationName'
import { Step } from '.'

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

const StyledImage = styled(CroppedImage)``

export function LocationInfoStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocationPopup' })
  const { dispatch } = useAdventureUIState()
  const location = useSelectedAdventureLocation()

  const preview = () => {
    dispatch({ type: AdventureUIActionType.SetPopupStep, data: Step.PreviewOtto })
  }

  return (
    <StyledContainer>
      {location && (
        <AdventureLocationProvider location={location}>
          <StyledHead bg={location.bgImage}>
            <StyledName location={location} />
            <StyledImageWrapper>
              <StyledImage layout="fill" src={location.image} />
            </StyledImageWrapper>
          </StyledHead>
          <StyledDetails>
            <AdventureRewards />
            <AdventureConditionalBoosts noPreview />
            <AdventureOngoingOttos />
            <Button padding="3px 0" Typography={Headline} onClick={preview}>
              {t('nextStep')}
            </Button>
          </StyledDetails>
        </AdventureLocationProvider>
      )}
    </StyledContainer>
  )
}
