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
    const currentOttoEquippedTraits = (otto?.wearableTraits ?? []).reduce(
      (map, trait) => Object.assign(map, { [trait.id]: trait }),
      {} as { [k: string]: Trait }
    )
    const defaultItemMetadata = otto?.nativeItemsMetadata.find(trait => trait.type === traitType)
    let restItems = filteredItems

    {
      const items: Item[] = []
      const map: { [k: string]: number } = {}
      restItems.forEach(item => {
        if (
          map[item.metadata.tokenId] !== undefined &&
          items[map[item.metadata.tokenId]].equippedBy &&
          !currentOttoEquippedTraits[item.metadata.tokenId]
        ) {
          items[map[item.metadata.tokenId]] = item
        } else if (!items[map[item.metadata.tokenId]]) {
          map[item.metadata.tokenId] = items.length
          items.push(item)
        }
      })
      restItems = items
    }

    restItems = restItems
      .filter(item => otto?.canWear(item) && currentOttoEquippedItem?.metadata?.tokenId !== item.metadata.tokenId)
      .slice()

    return { currentOttoEquippedItem, defaultItemMetadata, restItems }
  }, [filteredItems, traitType, otto])

  return (
    <StyledItems>
      <StyledItem
        key={`default_${defaultItemMetadata?.tokenId ?? 'empty'}`}
        hideAmount
        metadata={defaultItemMetadata}
        currentOtto={otto}
        onClick={() => selectItem(defaultItemMetadata?.tokenId ? 'native' : 'empty')}
        selected={selectedItemId === 'native' || selectedItemId === 'empty'}
      />
      {currentOttoEquippedItem && (
        <StyledItem
          key={currentOttoEquippedItem.metadata.tokenId}
          hideAmount
          metadata={currentOttoEquippedItem.metadata}
          currentOtto={otto}
          onClick={() => selectItem(currentOttoEquippedItem.id)}
          selected={selectedItemId === currentOttoEquippedItem.id}
        />
      )}
      {restItems.map(item => (
        <StyledItem
          key={item.metadata.tokenId}
          hideAmount
          unavailable={!isWearable(item.metadata.tokenId)}
          item={item}
          currentOtto={otto}
          onClick={() => selectItem(item.id)}
          selected={selectedItemId === item.id}
        />
      ))}
    </StyledItems>
  )
}
