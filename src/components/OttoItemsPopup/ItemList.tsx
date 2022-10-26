import styled from 'styled-components/macro'
import { useItemFilters } from 'contexts/ItemFilters'
import ItemCell from 'components/ItemCell'
import Otto, { Trait } from 'models/Otto'
import { Note } from 'styles/typography'
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

const StyledNoItems = styled(Note)`
  display: flex;
  flex-items: center;
  justify-content: center;
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
  const selectedItem = useMyItem(selectedItemId)
  const { defaultItemMetadata, restItems } = useMemo(() => {
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

    restItems = restItems.filter(item => otto?.canWear(item)).slice()

    return { defaultItemMetadata, restItems }
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
      {restItems.map(item => (
        <StyledItem
          key={item.id}
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
