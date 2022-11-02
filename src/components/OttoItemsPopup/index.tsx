import AdventureFullscreen from 'components/AdventureFullscreen'
import { FilterSelector, SortedBySelector } from 'components/ItemFilterSelect'
import OttoAttrs from 'components/OttoAttrs'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { ItemFiltersProvider } from 'contexts/ItemFilters'
import { useMyItems } from 'contexts/MyItems'
import { useTrait } from 'contexts/TraitContext'
import useAdventurePreviewItems from 'hooks/useAdventurePreviewItems'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'
import ItemList from './ItemList'
import ItemPreview from './ItemPreview'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -25px;
  gap: 20px;
  max-height: calc(80vh - 2px);
  overflow-y: scroll;
  padding: 35px 18px 15px;
  height: 100vh;
`

const StyledTitle = styled(ContentExtraSmall)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
`

const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledAction = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledActionLabel = styled(Note)``

const StyledFullscreen = styled(AdventureFullscreen)<{ maxWidth?: number }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.white} !important;
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}px;`}

  .fullscreen-inner {
    padding: 0 !important;
  }
`

const StyledOttoAttrs = styled(OttoAttrs)`
  .otto-level {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.otterBlack};

    &::before {
      color: ${({ theme }) => theme.colors.otterBlack};
    }
  }
`

export interface OttoItemsPopupProps {
  className?: string
  onRequestClose?: () => void
  maxWidth?: number
}

export default memo(function OttoItemsPopup({ className, maxWidth, onRequestClose }: OttoItemsPopupProps) {
  const container = useRef<HTMLDivElement>(null)
  const { draftOtto: otto } = useAdventureOtto()
  const { traitType } = useTrait()
  const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
  // eslint-disable-next-line prefer-const
  let { items, refetch } = useMyItems()
  items = useAdventurePreviewItems(items, otto)
  const [selectedItemId, selectItem] = useState<string>()
  const filteredItems = items.filter(item => item.metadata.type === traitType)
  const selectedItem = useMemo(() => items.find(({ id }) => id === selectedItemId), [items, selectedItemId])
  let selectedItemMetadata = filteredItems?.find(({ id }) => id === selectedItemId)?.metadata
  const equippedItemMetadata = otto?.equippedItems.find(({ id }) => id === selectedItemId)?.metadata
  const nativeItemMetadata = otto?.nativeItemsMetadata.find(({ type }) => type === traitType)
  const show = Boolean(traitType)

  if (!selectedItemMetadata && equippedItemMetadata) {
    selectedItemMetadata = equippedItemMetadata
  }

  if (selectedItemId === 'native') {
    selectedItemMetadata = nativeItemMetadata
  }

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [otto?.id, show])

  useEffect(() => {
    if (!traitType) {
      selectItem(undefined)
    }
  }, [Boolean(traitType)])

  return (
    <ItemFiltersProvider items={filteredItems}>
      <StyledFullscreen className={className} show={show} onRequestClose={onRequestClose} maxWidth={maxWidth}>
        <StyledContainer ref={container}>
          <StyledTitle>{t('title', { type: traitType })}</StyledTitle>
          <StyledOttoAttrs levelClassName="otto-level" />
          <StyledActions>
            <StyledAction>
              <StyledActionLabel>{t('sort')}</StyledActionLabel>
              <SortedBySelector />
            </StyledAction>
            <StyledAction>
              <StyledActionLabel>{t('filter')}</StyledActionLabel>
              <FilterSelector />
            </StyledAction>
          </StyledActions>

          <ItemList otto={otto} selectedItemId={selectedItemId} selectItem={selectItem} />

          <ItemPreview
            metadata={selectedItemMetadata}
            selectedItem={selectedItem}
            selectedItemId={selectedItemId}
            onItemUpdated={onRequestClose}
            onClose={() => selectItem(undefined)}
          />
        </StyledContainer>
      </StyledFullscreen>
    </ItemFiltersProvider>
  )
})
