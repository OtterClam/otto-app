import RealDropdown, { DropdownPostion } from 'components/RealDropdown'
import { ItemsFilter, ItemsOrder, ItemsSortBy, useItemFilters } from 'contexts/ItemFilters'
import noop from 'lodash/noop'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Note } from 'styles/typography'

const StyledBottom = styled(Note).attrs({ as: 'button' })`
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  height: 37px;
  display: flex;
  align-items: center;
`

const StyledItems = styled(Note).attrs({ as: 'ul' })`
  padding: 5px 10px;
  background: ${({ theme }) => theme.colors.white};
  list-style: none;
  margin: 0;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledItem = styled.li`
  height: 37px;
  display: flex;
  align-items: center;
`

interface ItemFilterSelectProps<T = any> {
  value?: T
  items: { key: T; label: string }[]
  onSelect?: (key: T) => void
  position?: DropdownPostion
}

const ItemFilterSelect = memo(function ItemFilterSelect({
  value,
  items,
  position,
  onSelect = noop,
}: ItemFilterSelectProps) {
  const label = items.find(item => item.key === value)?.label

  useEffect(() => {
    onSelect(items[0].key)
  }, [])

  return (
    <RealDropdown
      position={position}
      content={close => (
        <StyledItems>
          {items.map(item => (
            <StyledItem
              key={String(item.key)}
              onClick={() => {
                close()
                onSelect(item.key)
              }}
            >
              {item.label}
            </StyledItem>
          ))}
        </StyledItems>
      )}
    >
      <StyledBottom>{label}</StyledBottom>
    </RealDropdown>
  )
})

export function SortedBySelector() {
  const { sortedBy, setSortedBy } = useItemFilters()
  const { t } = useTranslation('', { keyPrefix: 'itemFilters.attrs' })

  const items = useMemo(
    () =>
      Object.values(ItemsSortBy).map(option => ({
        key: option,
        label: t(option),
      })),
    []
  )

  return <ItemFilterSelect value={sortedBy} items={items} onSelect={setSortedBy} />
}

export function OrderSelector() {
  const { order, setOrder } = useItemFilters()
  const { t } = useTranslation('', { keyPrefix: 'itemFilters.order' })

  const items = useMemo(() => {
    return [
      { key: ItemsOrder.Desc, label: t('desc') },
      { key: ItemsOrder.Asc, label: t('asc') },
    ]
  }, [])

  return <ItemFilterSelect value={order} items={items} onSelect={setOrder} />
}

export function FilterSelector() {
  const { filter, setFilter } = useItemFilters()
  const { t } = useTranslation('', { keyPrefix: 'itemFilters.filters' })

  const items = useMemo(
    () =>
      Object.values(ItemsFilter).map(option => ({
        key: option,
        label: t(option),
      })),
    []
  )

  return <ItemFilterSelect value={filter} items={items} onSelect={setFilter} position={DropdownPostion.TopRight} />
}
