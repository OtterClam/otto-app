import AdventureFullscreen from 'components/AdventureFullscreen'
import { FilterSelector, SortedBySelector } from 'components/ItemFilterSelect'
import OttoLevels from 'components/OttoLevels'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { ItemFiltersProvider } from 'contexts/ItemFilters'
import { useMyItems } from 'contexts/MyItems'
import { useTrait } from 'contexts/TraitContext'
import useIsWearable from 'hooks/useIsWearable'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useState } from 'react'
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

const StyledFullscreen = styled(AdventureFullscreen)`
  width: 100%;
  max-width: 375px;

  .fullscreen-inner {
    padding: 0 !important;
  }
`

const StyledOttoLevels = styled(OttoLevels)`
  .otto-level {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.otterBlack};

    &::before {
      color: ${({ theme }) => theme.colors.otterBlack};
    }
  }
`

export interface OttoItemsPopupProps {
  onRequestClose?: () => void
}

export default memo(function OttoItemsPopup({ onRequestClose }: OttoItemsPopupProps) {
  const { draftOtto: otto } = useAdventureOtto()
  const { trait } = useTrait()
  const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
  const { items, refetch } = useMyItems()
  const [selectedItemId, selectItem] = useState<string>()
  const isWearable = useIsWearable()
  const filteredItems = items.filter(item => item.type === trait?.type)
  const selectedItem = filteredItems.find(({ id }) => id === selectedItemId)

  useEffect(() => {
    refetch()
  }, [otto?.tokenId])

  return (
    <ItemFiltersProvider items={filteredItems}>
      <StyledFullscreen show={Boolean(trait)} onRequestClose={onRequestClose}>
        <StyledContainer>
          <StyledTitle>{t('title', { type: trait?.type })}</StyledTitle>

          <StyledOttoLevels levelClassName="otto-level" />

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
            onClose={() => selectItem(undefined)}
          />
        </StyledContainer>
      </StyledFullscreen>
    </ItemFiltersProvider>
  )
})
