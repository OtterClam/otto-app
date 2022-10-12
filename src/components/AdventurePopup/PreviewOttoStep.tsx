import useResizeObserver from '@react-hook/resize-observer'
import AdventureConditionalBoosts from 'components/AdventureConditionalBoosts'
import AdventureRewards from 'components/AdventureRewards'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import OttoAdventureLevel from 'components/OttoAdventureLevel'
import OttoAttributes from 'components/OttoAttributes'
import OttoLevels from 'components/OttoLevels'
import OttoPreviewer from 'components/OttoPreviewer'
import OttoSelector from 'components/OttoSelector'
import { ItemActionType } from 'constant'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import { AdventureOttoProvider } from 'contexts/AdventureOtto'
import {
  AdventurePopupStep,
  useCloseAdventurePopup,
  useGoToAdventurePopupStep,
  useSelectedAdventureLocation,
} from 'contexts/AdventureUIState'
import { useApiCall } from 'contexts/Api'
import { useOtto } from 'contexts/Otto'
import { useAdventureContract } from 'contracts/contracts'
import { useAdventureExplore } from 'contracts/functions'
import { ItemAction } from 'models/Item'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium, Headline } from 'styles/typography'

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
  const container = useRef<HTMLDivElement>(null)
  const { updateOtto, loading: loadingOttos } = useMyOttos()
  const { otto, itemActions: equippedItemActions, setOtto } = useOtto()
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const { t } = useTranslation()
  const location = useSelectedAdventureLocation()!
  const close = useCloseAdventurePopup()
  const goToStep = useGoToAdventurePopupStep()
  const adventureContract = useAdventureContract()
  const [{ itemPopupWidth, itemPopupHeight, itemPopupOffset }, setItemPopupSize] = useState<{
    itemPopupWidth: number
    itemPopupHeight?: number
    itemPopupOffset: number
  }>({
    itemPopupWidth: 375,
    itemPopupOffset: 0,
  })

  const actions = useMemo(() => {
    if (!otto) {
      return []
    }
    const actions = equippedItemActions.slice()
    Object.keys(usedPotionAmounts).forEach(potion => {
      const amount = usedPotionAmounts[potion]
      for (let i = 0; i <= amount; i += 1) {
        actions.push({
          type: ItemActionType.Use,
          item_id: Number(potion),
        })
      }
    })
    return actions
  }, [equippedItemActions, usedPotionAmounts])

  const { result: preview } = useApiCall(
    'getOttoAdventurePreview',
    [otto?.id ?? '', location?.id ?? -1, actions],
    Boolean(otto && location),
    [otto, location, actions]
  )

  const { explore, exploreState, resetExplore } = useAdventureExplore()

  const handleExploreButtonClick = useCallback(() => {
    if (!otto || !location) {
      return
    }

    const potionActions = Object.keys(usedPotionAmounts)
      .map(potion => {
        const actions: ItemAction[] = []
        const amount = usedPotionAmounts[potion]
        for (let i = 0; i < amount; i += 1) {
          actions.push({
            type: ItemActionType.Use,
            item_id: Number(potion),
          })
        }
        return actions
      })
      .reduce((all, list) => all.concat(list), [] as ItemAction[])

    explore(otto.id, location.id, [...potionActions, ...equippedItemActions])
  }, [otto, location, usedPotionAmounts, explore, equippedItemActions])

  useEffect(() => {
    if (exploreState.state === 'Success' && exploreState.passId && otto) {
      adventureContract
        .pass(exploreState.passId)
        .then(pass => {
          otto.explore(pass)
          setOtto(otto)
          updateOtto(otto)
        })
        .then(() => goToStep(AdventurePopupStep.ReadyToGo))
        .catch(err => console.error(err))
    } else if (exploreState.state === 'Fail') {
      alert(exploreState.status.errorMessage)
      resetExplore()
    }
  }, [exploreState, adventureContract])

  useResizeObserver(container, () => {
    const rect = container?.current?.getBoundingClientRect()
    const itemPopupWidth = (rect?.width ?? 750) / 2
    const itemPopupHeight = rect ? rect.height - 40 : undefined
    const itemPopupOffset = Math.max(((rect?.width ?? 0) - itemPopupWidth) / 2, 0) - 20
    setItemPopupSize({ itemPopupWidth, itemPopupHeight, itemPopupOffset })
  })

  return (
    <AdventureLocationProvider location={preview?.location}>
      <AdventureOttoProvider otto={otto} preview={preview}>
        <StyledContainer bg={location.bgImageBlack} ref={container}>
          <StyledHead>
            <Button
              primaryColor="white"
              Typography={ContentMedium}
              padding="0 10px"
              onClick={() => goToStep(AdventurePopupStep.LocationInfo)}
            >
              {'<'}
            </Button>
            <StyledTitle>{t('adventurePopup.previewOttoTitle')}</StyledTitle>
            <CloseButton color="white" onClose={close} />
          </StyledHead>

          <OttoSelector />

          <StyledMain>
            <StyledPreview>
              <OttoPreviewer
                itemPopupOffset={itemPopupOffset}
                itemsPopupWidth={itemPopupWidth}
                itemPopupHeight={itemPopupHeight}
              />
              {otto && <OttoAdventureLevel otto={otto} boost />}
              <OttoAttributes />
              <OttoLevels />
            </StyledPreview>

            <StyledLocation>
              <AdventureConditionalBoosts />
              <AdventureRewards canUsePotions onUsePotion={setUsedPotionAmounts} />
            </StyledLocation>
          </StyledMain>

          <Button
            padding="3px 0 0"
            Typography={Headline}
            loading={exploreState.state === 'Processing' || loadingOttos}
            onClick={handleExploreButtonClick}
          >
            {t('adventurePopup.start')}
          </Button>
        </StyledContainer>
      </AdventureOttoProvider>
    </AdventureLocationProvider>
  )
}
