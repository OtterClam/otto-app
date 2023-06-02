import styled from 'styled-components'
import { useRepositories } from 'contexts/Repositories'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ContentMedium, ContentSmall, Headline, Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'
import OttoPreviewer from 'components/OttoPreviewer'
import useResizeObserver from '@react-hook/resize-observer'
import OttoAdventureLevel from 'components/OttoAdventureLevel'
import OttoAttrs from 'components/OttoAttrs'
import OttoStats from 'components/OttoStats'
import { raritySort } from 'contexts/ItemFilters'
import { useMyItems } from 'contexts/MyItems'
import { useOtto } from 'contexts/Otto'
import Otto from 'models/Otto'
import { AdventureOttoProvider } from 'contexts/AdventureOtto'
import { useDoItemBatchActions } from 'contracts/functions'
import { useMyOttos } from 'MyOttosProvider'
import UseItemCompleteView from 'views/my-items/use-item/UseItemCompleteView'
import { useDispatch } from 'react-redux'
import { hideOttoPopup } from 'store/uiSlice'
import { Item } from 'models/Item'

const StyledContainer = styled.div`
  display: grid;
  grid-template:
    'title title' 36px
    'buttons buttons'
    'info placeholder' auto / 1fr 1fr;
  gap: 20px;
  margin: 12px 24px 24px 24px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: block;
  }
`

const StyledTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  display: flex;
  grid-area: title;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  gap: 10px;
`

const StyledOttoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-area: info;
`

const StyledPlaceholder = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: placeholder;
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledEquipButtons = styled.div`
  display: flex;
  grid-area: buttons;
`

const StyledEquipButton = styled(Button).attrs({ padding: '0 12px', primaryColor: 'white' })``

const StyledSubmitButton = styled(Button)``

const StyledSubmitButtonHelp = styled(Note)`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`

const wearableTraitTypes = ['Holding', 'Headwear', 'Facial Accessories', 'Clothes', 'Background']

export default function OttoPopupBody() {
  const dispatch = useDispatch()
  const container = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('', { keyPrefix: 'ottoPopup' })
  const [preview, setPreview] = useState<{ otto: Otto }>()
  const { updateOtto } = useMyOttos()
  const [saved, setSaved] = useState(false)
  const [oldOtto, setOldOtto] = useState<Otto | undefined>()
  const { otto, itemActions, unequipAllItems, equipItem, removeItem, setOtto } = useOtto()
  const { ottos: ottosRepo } = useRepositories()
  const [loadingPreviewData, setLoadingPreviewData] = useState(false)
  const { doItemBatchActions, doItemBatchActionsState, resetDoItemBatchActions } = useDoItemBatchActions()
  const [{ itemPopupWidth, itemPopupHeight, itemPopupOffset }, setItemPopupSize] = useState<{
    itemPopupWidth: number
    itemPopupHeight?: number
    itemPopupOffset: number
  }>({
    itemPopupWidth: 375,
    itemPopupOffset: 0,
  })
  const { items } = useMyItems()
  const loading = loadingPreviewData || !otto
  const txPending = doItemBatchActionsState.state === 'Processing'

  useResizeObserver(container, () => {
    const rect = container?.current?.getBoundingClientRect()
    const itemPopupWidth = (rect?.width ?? 750) / 2
    const itemPopupHeight = rect ? rect.height - 40 : undefined
    const itemPopupOffset = Math.max(((rect?.width ?? 0) - itemPopupWidth) / 2, 0) - 20
    setItemPopupSize({ itemPopupWidth, itemPopupHeight, itemPopupOffset })
  })

  useEffect(() => {
    if (doItemBatchActionsState.state === 'Success' && otto) {
      otto.raw.resting_until = doItemBatchActionsState.restingUntil?.toISOString()
      if (preview?.otto) {
        setOtto(preview.otto.clone())
        updateOtto(preview.otto)
      }
      setSaved(true)
    } else if (doItemBatchActionsState.state === 'Fail') {
      alert(doItemBatchActionsState.status.errorMessage)
      resetDoItemBatchActions()
    }
  }, [doItemBatchActionsState, otto, preview, resetDoItemBatchActions, setOtto, updateOtto])

  useEffect(() => {
    if (!otto) {
      return
    }

    setLoadingPreviewData(true)
    const controller = new AbortController()
    const timer = setTimeout(() => {
      ottosRepo
        .withAbortSignal(controller.signal)
        .previewAdventureOtto(otto.id, undefined, itemActions)
        .then(setPreview)
        .finally(() => setLoadingPreviewData(false))
    }, 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [otto, ottosRepo, otto?.id, itemActions])

  const ottomize = useCallback(() => {
    wearableTraitTypes.forEach(traitType => {
      let filteredItems = items.filter(
        item =>
          (!item.equippedBy || item.equippedBy === otto?.id) && item.metadata.type === traitType && otto?.canWear(item)
      )
      filteredItems = filteredItems.sort(raritySort)
      const bestItem = filteredItems.at(0)
      if (bestItem) {
        const nativeItem = otto?.ottoNativeTraits.find(nativeTrait => nativeTrait.type === traitType)
        if (
          nativeItem &&
          (nativeItem.theme_boost > bestItem.metadata.themeBoost ||
            (nativeItem.theme_boost === bestItem.metadata.themeBoost &&
              nativeItem.total_rarity_score > bestItem.metadata.totalRarityScore))
        ) {
          removeItem(traitType)
        } else {
          equipItem(traitType, bestItem.metadata.tokenId)
        }
      }
    })
  }, [otto, items, equipItem, removeItem])

  if (saved && oldOtto) {
    return (
      <UseItemCompleteView
        otto={oldOtto}
        updatedOtto={preview?.otto}
        hideCloseButton
        onClose={() => dispatch(hideOttoPopup())}
      />
    )
  }

  return (
    <AdventureOttoProvider otto={otto} draftOtto={preview?.otto} actions={itemActions}>
      <StyledContainer ref={container}>
        <StyledTitle>
          <Headline>{t('title')}</Headline>
        </StyledTitle>
        <StyledEquipButtons>
          <StyledEquipButton Typography={ContentMedium} onClick={unequipAllItems}>
            {t('unequipAllButton')}
          </StyledEquipButton>
          <StyledEquipButton Typography={ContentMedium} onClick={ottomize}>
            {t('ottomize')}
          </StyledEquipButton>
        </StyledEquipButtons>

        <StyledOttoInfo>
          <OttoPreviewer
            hideFeedButton
            loading={loading}
            itemsPopupWidth={itemPopupWidth}
            itemPopupHeight={itemPopupHeight}
            itemPopupOffset={itemPopupOffset}
          />

          <OttoAdventureLevel otto={preview?.otto} loading={loading} />

          <OttoAttrs loading={loading} />

          <OttoStats showScore loading={loading} />

          <StyledSubmitButton
            disabled={!otto || itemActions.length === 0 || loading}
            loading={txPending}
            Typography={Headline}
            onClick={() => {
              if (otto) {
                setOldOtto(otto)
                doItemBatchActions(otto.id, itemActions)
              }
            }}
          >
            {t('submitButton')}
          </StyledSubmitButton>

          <StyledSubmitButtonHelp as="p">{t('submitButtonHelp')}</StyledSubmitButtonHelp>
        </StyledOttoInfo>

        <StyledPlaceholder>
          <ContentSmall dangerouslySetInnerHTML={{ __html: t('placeholder') }} />
        </StyledPlaceholder>
      </StyledContainer>
    </AdventureOttoProvider>
  )
}
