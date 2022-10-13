import AdventureFullscreen from 'components/AdventureFullscreen'
import { FilterSelector, SortedBySelector } from 'components/ItemFilterSelect'
import OttoAttrs from 'components/OttoAttrs'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { ItemFiltersProvider } from 'contexts/ItemFilters'
import { useMyItems } from 'contexts/MyItems'
import { useTrait } from 'contexts/TraitContext'
import useIsWearable from 'hooks/useIsWearable'
import { traitToItem } from 'models/Item'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useRef, useState } from 'react'
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
  const { items, refetch } = useMyItems()
  const [selectedItemId, selectItem] = useState<string>()
  const isWearable = useIsWearable(items)
  const filteredItems = items.filter(item => item.type === traitType)
  const equippedTrait = otto?.wearableTraits.find(trait => trait.type === traitType)
  let selectedItem = filteredItems.find(({ id }) => id === selectedItemId)
  if (!selectedItem && equippedTrait && selectedItemId === equippedTrait.id) {
    selectedItem = traitToItem(equippedTrait)
  }

  useEffect(() => {
    refetch()
  }, [otto?.id])

  return (
    <ItemFiltersProvider items={filteredItems}>
      <StyledFullscreen
        className={className}
        show={Boolean(traitType)}
        onRequestClose={onRequestClose}
        maxWidth={maxWidth}
      >
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

          <ItemList otto={otto} isWearable={isWearable} selectedItemId={selectedItemId} selectItem={selectItem} />

          <ItemPreview
            item={selectedItem}
            unavailable={selectedItem && !isWearable(selectedItem.id)}
            onItemUpdated={onRequestClose}
            onClose={() => selectItem(undefined)}
          />
        </StyledContainer>
      </StyledFullscreen>
    </ItemFiltersProvider>
  )
})
