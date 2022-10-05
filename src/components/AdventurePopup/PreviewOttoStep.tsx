import AdventureConditionalBoosts from 'components/AdventureConditionalBoosts'
import AdventureRewards from 'components/AdventureRewards'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import OttoAdventureLevel from 'components/OttoAdventureLevel'
import OttoAttributes from 'components/OttoAttributes'
import OttoLevels from 'components/OttoLevels'
import OttoPreviewer from 'components/OttoPreviewer'
import OttoSelector from 'components/OttoSelector'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import { AdventureOttoProvider } from 'contexts/AdventureOtto'
import { useAdventureOttos } from 'contexts/AdventureOttos'
import {
  useCloseAdventurePopup,
  useGoToAdventurePopupStep,
  useSelectedAdventureLocation,
} from 'contexts/AdventureUIState'
import { useApiCall } from 'contexts/Api'
import { useOtto } from 'contexts/Otto'
import { useAdventureDeparture } from 'contracts/functions'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium, Headline } from 'styles/typography'
import { Step } from '.'

const StyledContainer = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: center / cover url(${({ bg }) => bg});
  padding: 20px 37px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px 20px;
  }
`

const StyledMain = styled.div`
  display: flex;
  gap: 40px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledLocation = styled.div`
  flex: 1 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
`

const StyledPreview = styled.div`
  flex: 1 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
`

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  margin: -15px -20px 0 -20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin: -15px -10px 0 -10px;
  }
`

const StyledTitle = styled(ContentMedium)`
  flex: 1;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`

export default function PreviewOttoStep() {
  const { otto, equippedItems, loading: loadingOttos, reload: reloadMyOttos } = useOtto()
  const { loading: loadingAdventureOttos, refetch: reloadAdventureOttos } = useAdventureOttos()
  const { t } = useTranslation()
  const location = useSelectedAdventureLocation()!
  const close = useCloseAdventurePopup()
  const goToStep = useGoToAdventurePopupStep()

  const itemIds = equippedItems.map(item => item.id)

  const { result: preview } = useApiCall(
    'getOttoAdventurePreview',
    [otto?.tokenId ?? '', location?.id ?? -1, itemIds],
    Boolean(otto && location),
    [otto, location, itemIds.join(', ')]
  )

  const { departure, loading, readyToGo } = useAdventureDeparture()

  useEffect(() => {
    if (readyToGo) {
      Promise.all([reloadMyOttos(), reloadAdventureOttos()]).then(() => goToStep(Step.ReadyToGo))
    }
  }, [readyToGo])

  return (
    <AdventureLocationProvider location={preview?.location}>
      <AdventureOttoProvider otto={otto} preview={preview}>
        <StyledContainer bg={location.bgImageBlack}>
          <StyledHead>
            <Button
              primaryColor="white"
              Typography={ContentMedium}
              padding="0 10px"
              onClick={() => goToStep(Step.LocationInfo)}
            >
              {'<'}
            </Button>
            <StyledTitle>{t('adventurePopup.prevewOttoTitle')}</StyledTitle>
            <CloseButton color="white" onClose={close} />
          </StyledHead>

          <OttoSelector />

          <StyledMain>
            <StyledPreview>
              <OttoPreviewer />
              <OttoAdventureLevel boost />
              <OttoAttributes />
              <OttoLevels />
            </StyledPreview>

            <StyledLocation>
              <AdventureConditionalBoosts />
              <AdventureRewards />
            </StyledLocation>
          </StyledMain>

          <Button
            padding="3px 0 0"
            Typography={Headline}
            loading={loading || loadingOttos || loadingAdventureOttos}
            onClick={() => departure(otto!.tokenId, location!.id)}
          >
            {t('adventurePopup.start')}
          </Button>
        </StyledContainer>
      </AdventureOttoProvider>
    </AdventureLocationProvider>
  )
}
