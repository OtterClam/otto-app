import noop from 'lodash/noop'
import { Item } from 'models/Item'
import { OttoGender, TraitRarity } from 'models/Otto'
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
  Collectible = 'Collectible',
  Other = 'Other',
}

export interface ItemFilters {
  order: ItemsOrder
  sortedBy?: ItemsSortBy
  filter?: ItemsFilter
  searchString?: string
  itemType: ItemType
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  setOrder: (order: ItemsOrder) => void
  setSortedBy: (sortedBy: ItemsSortBy) => void
  setFilter: (filter: ItemsFilter) => void
  setSearchString: (searchString: string) => void
  setItemType: (type: ItemType) => void
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  items: Item[]
  filteredItems: Item[]
}

const ItemFiltersContext = createContext<ItemFilters>({
  order: ItemsOrder.Desc,
  itemType: ItemType.All,
  page: 0,
  hasNextPage: false,
  hasPrevPage: false,
  setOrder: noop,
  setSortedBy: noop,
  setFilter: noop,
  setSearchString: noop,
  setItemType: noop,
  setPage: noop,
  nextPage: noop,
  prevPage: noop,
  items: [],
  filteredItems: [],
})

export interface ItemFiltersProviderProps {
  items: Item[]
  itemsPerPage?: number
}

const filterFunctions = {
  [ItemsFilter.None]: () => true,
  [ItemsFilter.Equipped]: (item: Item) => Boolean(item.equippedBy),
  [ItemsFilter.NotEquipped]: (item: Item) => !item.equippedBy,
  [ItemsFilter.LottieSpecific]: (item: Item) => item.metadata.equippableGender === 'Female',
  [ItemsFilter.OttoSpecific]: (item: Item) => item.metadata.equippableGender === 'Male',
}

type SortableFields<T extends object> = {
  [P in keyof T as T[P] extends number | Date ? P : never]: T[P]
}

function createSortFunction(key: keyof SortableFields<Item['metadata']>) {
  return (lhs: Item, rhs: Item) => rhs.metadata[key] - lhs.metadata[key]
}

const typeClassMap: { [key: string]: number } = {
  Holding: 10,
  Headwear: 10,
  'Facial Accessories': 10,
  Clothes: 10,
  Background: 10,
  Coupon: 9,
  Consumable: 8,
  'Mission Item': 7,
  Collectible: 6,
  Other: 5,
}
const rarityClassMap: { [key: string]: number } = {
  E1: 300,
  E2: 290,
  E3: 280,
  R1: 200,
  R2: 190,
  R3: 180,
  C1: 100,
  C2: 90,
  C3: 80,
}

function raritySort(lhs: Item, rhs: Item) {
  let cmp = typeClassMap[rhs.metadata.type] - typeClassMap[lhs.metadata.type]
  if (cmp !== 0) return cmp
  if (lhs.metadata.type === 'Mission Item' || lhs.metadata.type === 'Collectible') {
    return rarityClassMap[rhs.metadata.rarity] - rarityClassMap[lhs.metadata.rarity]
  }
  cmp = rhs.metadata.themeBoost - lhs.metadata.themeBoost
  if (cmp !== 0) return cmp
  cmp = rhs.metadata.totalRarityScore - lhs.metadata.totalRarityScore
  if (cmp !== 0) return cmp
  cmp = rhs.metadata.baseRarityScore - lhs.metadata.baseRarityScore
  if (cmp !== 0) return cmp
  return rarityClassMap[rhs.metadata.rarity] - rarityClassMap[lhs.metadata.rarity]
}

const sortFunctions = {
  [ItemsSortBy.TimeReceived]: (lhs: Item, rhs: Item) => rhs.updatedAt.getTime() - lhs.updatedAt.getTime(),
  [ItemsSortBy.Rarity]: raritySort,
  [ItemsSortBy.Dex]: createSortFunction('dex'),
  [ItemsSortBy.Luck]: createSortFunction('luck'),
  [ItemsSortBy.Cute]: createSortFunction('cute'),
  [ItemsSortBy.Def]: createSortFunction('def'),
  [ItemsSortBy.Str]: createSortFunction('str'),
  [ItemsSortBy.Int]: createSortFunction('int'),
  [ItemsSortBy.Con]: createSortFunction('con'),
}

export const ItemFiltersProvider = ({ children, items, itemsPerPage }: PropsWithChildren<ItemFiltersProviderProps>) => {
  const [order, setOrder] = useState<ItemsOrder>(ItemsOrder.Desc)
  const [sortedBy, setSortedBy] = useState<ItemsSortBy>(ItemsSortBy.TimeReceived)
  const [filter, setFilter] = useState<ItemsFilter>(ItemsFilter.None)
  const [searchString, setSearchString] = useState<string>('')
  const [itemType, setItemType] = useState<ItemType>(ItemType.All)
  const [page, setPage] = useState<number>(0)

  const value = useMemo(() => {
    let filteredItems = items.filter(filterFunctions[filter])

    switch (itemType) {
      case ItemType.All:
        // do nothing
        break
      case ItemType.Other:
        const typeValues = Object.values(ItemType)
        filteredItems = filteredItems.filter(item => !typeValues.includes(item.metadata.type as any))
        break
      default:
        filteredItems = filteredItems.filter(item => (item.metadata.type as any) === itemType)
    }

    if (searchString)
      filteredItems = filteredItems.filter(item => {
        return item.metadata.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
      })

    filteredItems = filteredItems.sort(sortFunctions[sortedBy])

    if (order === ItemsOrder.Asc) {
      filteredItems.reverse()
    }

    if (itemsPerPage) {
      filteredItems = filteredItems.slice(itemsPerPage * page, itemsPerPage * (page + 1))
    }

    const lastPage = Math.floor(items.length / (itemsPerPage ?? items.length))

    return {
      order,
      sortedBy,
      filter,
      searchString,
      itemType,
      page,
      setOrder,
      setSortedBy,
      setFilter,
      setSearchString,
      setItemType,
      setPage,
      hasNextPage: page !== lastPage,
      hasPrevPage: page !== 0,
      nextPage: () => setPage(page => Math.min(page + 1, lastPage)),
      prevPage: () => setPage(page => Math.max(0, page - 1)),
      items,
      filteredItems,
    }
  }, [order, sortedBy, filter, searchString, itemType, items, itemsPerPage, page])

  return <ItemFiltersContext.Provider value={value}>{children}</ItemFiltersContext.Provider>
}

export const useItemFilters = () => {
  return useContext(ItemFiltersContext)
}
