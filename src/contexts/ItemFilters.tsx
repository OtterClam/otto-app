import noop from 'lodash/noop'
import Item from 'models/Item'
import { OttoGender } from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

export enum ItemsFilter {
  None = 'none',
  NotEquipped = 'not_equipped',
  Equipped = 'equipped',
  OttoSpecific = 'otto_specific',
  LottieSpecific = 'lottie_specific',
}

export enum ItemsSortBy {
  TimeReceived = 'timeReceived',
  Rarity = 'rarity',
  Str = 'str',
  Dex = 'dex',
  Luck = 'luck',
  Cute = 'cute',
  Def = 'def',
  Int = 'int',
  Con = 'con',
}

export enum ItemsOrder {
  Desc = 'desc',
  Asc = 'asc',
}

export enum ItemType {
  All = 'All',
  Holding = 'Holding',
  Headwear = 'Headwear',
  FacialAccessories = 'Facial Accessories',
  Clothes = 'Clothes',
  Background = 'Background',
  Other = 'Other',
}

export interface ItemFilters {
  order: ItemsOrder
  sortedBy?: ItemsSortBy
  filter?: ItemsFilter
  itemType: ItemType
  setOrder: (order: ItemsOrder) => void
  setSortedBy: (sortedBy: ItemsSortBy) => void
  setFilter: (filter: ItemsFilter) => void
  setItemType: (type: ItemType) => void
  items: Item[]
  filteredItems: Item[]
}

const ItemFiltersContext = createContext<ItemFilters>({
  order: ItemsOrder.Desc,
  itemType: ItemType.All,
  setOrder: noop,
  setSortedBy: noop,
  setFilter: noop,
  setItemType: noop,
  items: [],
  filteredItems: [],
})

export interface ItemFiltersProviderProps {
  items: Item[]
}

const filterFunctions = {
  [ItemsFilter.None]: () => true,
  [ItemsFilter.Equipped]: (item: Item) => item.equipped,
  [ItemsFilter.NotEquipped]: (item: Item) => !item.equipped,
  [ItemsFilter.LottieSpecific]: (item: Item) => item.equippable_gender === OttoGender.Female,
  [ItemsFilter.OttoSpecific]: (item: Item) => item.equippable_gender === OttoGender.Male,
}

type SortableFields<T extends object> = {
  [P in keyof T as T[P] extends number | Date ? P : never]: T[P]
}

function createSortFunction(key: keyof SortableFields<Item>) {
  return (lhs: Item, rhs: Item) => rhs[key] - lhs[key]
}

const sortFunctions = {
  [ItemsSortBy.TimeReceived]: createSortFunction('update_at'),
  [ItemsSortBy.Rarity]: createSortFunction('total_rarity_score'),
  [ItemsSortBy.Dex]: createSortFunction('dex'),
  [ItemsSortBy.Luck]: createSortFunction('luck'),
  [ItemsSortBy.Cute]: createSortFunction('cute'),
  [ItemsSortBy.Def]: createSortFunction('def'),
  [ItemsSortBy.Str]: createSortFunction('str'),
  [ItemsSortBy.Int]: createSortFunction('int'),
  [ItemsSortBy.Con]: createSortFunction('con'),
}

export const ItemFiltersProvider = ({ children, items }: PropsWithChildren<ItemFiltersProviderProps>) => {
  const [order, setOrder] = useState<ItemsOrder>(ItemsOrder.Desc)
  const [sortedBy, setSortedBy] = useState<ItemsSortBy>(ItemsSortBy.TimeReceived)
  const [filter, setFilter] = useState<ItemsFilter>(ItemsFilter.None)
  const [itemType, setItemType] = useState<ItemType>(ItemType.All)

  const value = useMemo(() => {
    let filteredItems = items.filter(filterFunctions[filter])

    if (itemType !== ItemType.All) {
      filteredItems = filteredItems.filter(item => item.type === itemType)
    }

    filteredItems = filteredItems.sort(sortFunctions[sortedBy])

    if (order === ItemsOrder.Asc) {
      filteredItems.reverse()
    }

    return {
      order,
      sortedBy,
      filter,
      itemType,
      setOrder,
      setSortedBy,
      setFilter,
      setItemType,
      items,
      filteredItems,
    }
  }, [order, sortedBy, filter, itemType, items])

  return <ItemFiltersContext.Provider value={value}>{children}</ItemFiltersContext.Provider>
}

export const useItemFilters = () => {
  return useContext(ItemFiltersContext)
}
