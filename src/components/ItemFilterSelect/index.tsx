import { AscendingIcon, FilterIcon, SearchIcon, SortedIcon } from 'assets/icons'
import CloseIcon from 'assets/ui/close_icon_dark.svg'
import MenuButton from 'components/Button'
import RealDropdown, { DropdownPostion } from 'components/RealDropdown'
import { ItemsFilter, ItemsOrder, ItemsSortBy, useItemFilters } from 'contexts/ItemFilters'
import noop from 'lodash/noop'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { memo, useEffect, useMemo, useState, ReactElement } from 'react'
import styled from 'styled-components'
import { ContentSmall, Note, RegularInput } from 'styles/typography'

const StyledMenuItem = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const BlankIcon = styled.div`
  width: 30px;
  height: 30px;
`

const StyledItems = styled(Note).attrs({ as: 'ul' })`
  background: ${({ theme }) => theme.colors.white};
  list-style: none;
  margin: 0;
  border-radius: 6px;
  border: 0px;
`

const StyledItemsExpanded = styled(StyledItems)`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledItem = styled.li`
  padding: 5px 10px;
  height: 37px;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
    border-radius: 6px;
  }
`

interface ItemFilterSelectProps<T = any> {
  icon: ReactElement
  value?: T
  items: { key: T; label: string }[]
  onSelect?: (key: T) => void
  position?: DropdownPostion
}

const ItemFilterSelect = memo(function ItemFilterSelect({
  icon,
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
        <StyledItemsExpanded>
          {items.map((item, idx) => (
            <StyledItem
              key={String(item.key)}
              onClick={() => {
                close()
                onSelect(item.key)
              }}
            >
              {idx === 0 ? icon : <BlankIcon />}
              {item.label}
            </StyledItem>
          ))}
        </StyledItemsExpanded>
      )}
    >
      <StyledItems>
        <StyledItem>
          {useMemo(() => icon, [])}
          {label}
        </StyledItem>
      </StyledItems>
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

  return (
    <StyledMenuItem>
      <ItemFilterSelect icon={<SortedIcon />} value={sortedBy} items={items} onSelect={setSortedBy} />
    </StyledMenuItem>
  )
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

  return <ItemFilterSelect icon={<AscendingIcon />} value={order} items={items} onSelect={setOrder} />
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

  return (
    <ItemFilterSelect
      icon={<FilterIcon />}
      value={filter}
      items={items}
      onSelect={setFilter}
      position={DropdownPostion.TopLeft}
    />
  )
}

const StyledInput = styled(RegularInput)`
  border: 0px;
  border-radius: 6px;
  padding: 5px;
  width: 100%;
  background: ${({ theme }) => theme.colors.lightGray100};

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    background: ${({ theme }) => theme.colors.lightGray100};
    opacity: 1;
  }
`

const StyledSearchBar = styled(StyledMenuItem)`
  background: ${({ theme }) => theme.colors.lightGray100};
  border-radius: 6px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledCloseIcon = styled.button`
  padding-right: 5px;
  display: flex;
`

export const BlankCloseIcon = styled.div`
  width: 21px;
  height: 16px;
  padding-right: 5px;
`

export function SearchBar() {
  const { searchString, setSearchString } = useItemFilters()
  const onClear = () => {
    setSearchString('')
  }
  return (
    <StyledSearchBar>
      <SearchIcon />
      <StyledInput
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
      />
      {searchString ? (
        <StyledCloseIcon onClick={onClear}>
          <Image src={CloseIcon.src} alt="clear" width={16} height={16} />
        </StyledCloseIcon>
      ) : (
        <BlankCloseIcon />
      )}
    </StyledSearchBar>
  )
}
