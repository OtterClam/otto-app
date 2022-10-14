import styled from 'styled-components/macro'
import { useItemFilters } from 'contexts/ItemFilters'
import ItemCell from 'components/ItemCell'
import Otto, { OttoGender } from 'models/Otto'
import { Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { useTrait } from 'contexts/TraitContext'
import Item, { traitToItem } from 'models/Item'

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
  const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
  const { traitType } = useTrait()
  const { filteredItems } = useItemFilters()
  const { defaultItem, restItems } = useMemo(() => {
    const defaultTrait = otto?.wearableTraits.find(trait => trait.type === traitType && trait.unreturnable)
    let restItems = filteredItems

    {
      const items: Item[] = []
      const map: { [k: string]: number } = {}
      restItems.forEach(item => {
        if (map[item.id] !== undefined && items[map[item.id]].equipped) {
          items[map[item.id]] = item
        } else if (!items[map[item.id]]) {
          map[item.id] = items.length
          items.push(item)
        }
      })
      restItems = items
    }

    restItems = restItems.filter(item => otto?.canWear(item)).slice()

    const defaultItem = defaultTrait ? traitToItem(defaultTrait) : undefined

    return { defaultItem, restItems }
  }, [filteredItems, traitType, otto])

  if (!filteredItems.length) {
    return <StyledNoItems>{t('noItems')}</StyledNoItems>
  }

  return (
    <StyledItems>
      {defaultItem && (
        <StyledItem
          key={defaultItem.id}
          hideAmount
          item={defaultItem}
          currentOtto={otto}
          onClick={() => selectItem(defaultItem.id)}
          selected={selectedItemId === defaultItem.id}
        />
      )}
      {restItems.map(item => (
        <StyledItem
          key={item.id}
          hideAmount
          unavailable={!isWearable(item.id)}
          item={item}
          currentOtto={otto}
          onClick={() => selectItem(item.id)}
          selected={selectedItemId === item.id}
        />
      ))}
    </StyledItems>
  )
}
