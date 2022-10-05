import styled from 'styled-components/macro'
import { useItemFilters } from 'contexts/ItemFilters'
import ItemCell from 'components/ItemCell'
import Otto from 'models/Otto'
import { Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'

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
  const { filteredItems } = useItemFilters()

  if (!filteredItems.length) {
    return <StyledNoItems>{t('noItems')}</StyledNoItems>
  }

  return (
    <StyledItems>
      {filteredItems.map(item => (
        <StyledItem
          key={item.id}
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
