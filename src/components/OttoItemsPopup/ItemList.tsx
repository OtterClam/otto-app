import styled from 'styled-components/macro'
import { useItemFilters } from 'contexts/ItemFilters'
import ItemCell from 'components/ItemCell'
import Otto, { Trait } from 'models/Otto'
import { useMemo } from 'react'
import { useTrait } from 'contexts/TraitContext'
import { Item } from 'models/Item'
import { useMyItem } from 'contexts/MyItems'

const StyledItems = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(4, 1fr);
`

const StyledItem = styled(ItemCell)`
  width: 100%;
`

export interface ItemListProps {
  otto?: Otto
  isWearable: (itemId: string) => boolean
  selectedItemId?: string
  selectItem: (itemId?: string) => void
}

export default function ItemList({ otto, isWearable, selectItem, selectedItemId }: ItemListProps) {
  const { traitType } = useTrait()
  const { filteredItems } = useItemFilters()
  const { currentOttoEquippedItem, defaultItemMetadata, restItems } = useMemo(() => {
    const currentOttoEquippedItem = otto?.equippedItems?.find(
      item => item.equippedBy === otto.id && item.metadata.type === traitType
    )
    const defaultItemMetadata = otto?.nativeItemsMetadata.find(trait => trait.type === traitType)
    const restItems = filteredItems.filter(item => otto?.canWear(item) && currentOttoEquippedItem?.id !== item.id)

    return { currentOttoEquippedItem, defaultItemMetadata, restItems }
  }, [filteredItems, traitType, otto])

  return (
    <StyledItems>
      <StyledItem
        key={`default_${defaultItemMetadata?.tokenId ?? 'empty'}`}
        hideAmount
        metadata={defaultItemMetadata}
        currentOtto={otto}
        onClick={() => selectItem(defaultItemMetadata ? 'native' : 'empty')}
        selected={selectedItemId === 'native' || selectedItemId === 'empty'}
      />
      {currentOttoEquippedItem && (
        <StyledItem
          key={currentOttoEquippedItem.id}
          hideAmount
          item={currentOttoEquippedItem}
          currentOtto={otto}
          onClick={() => selectItem(currentOttoEquippedItem.id)}
          selected={selectedItemId === currentOttoEquippedItem.id}
        />
      )}
      {restItems.map(item => (
        <StyledItem
          key={item.id}
          hideAmount
          unavailable={!otto?.canWear(item)}
          item={item}
          currentOtto={otto}
          onClick={() => selectItem(item.id)}
          selected={selectedItemId === item.id}
        />
      ))}
    </StyledItems>
  )
}
