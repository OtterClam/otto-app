import { ItemActionType } from 'constant'
import { TraitCollection, TraitRarity, OttoGender, TraitLabel, Attr, Stat } from './Otto'

export type ItemType =
  | 'Holding'
  | 'Headwear'
  | 'Facial Accessories'
  | 'Clothes'
  | 'Background'
  | 'Coupon'
  | 'Mission Item'
  | 'Collectible'
  | 'Other'

export type ItemStats = Record<ItemStatName, string>

export enum ItemStatName {
  STR = 'STR',
  DEF = 'DEF',
  DEX = 'DEX',
  INT = 'INT',
  LUK = 'LUK',
  CON = 'CON',
  CUTE = 'CUTE',
}

export const parseItemStatName = (name: string): ItemStatName => {
  if (!Object.values(ItemStatName).includes(name as ItemStatName)) {
    throw new Error(`Unrecognized stat: ${name}`)
  }
  return name as ItemStatName
}

export const defaultStats = {
  [ItemStatName.STR]: '0',
  [ItemStatName.DEF]: '0',
  [ItemStatName.DEX]: '0',
  [ItemStatName.INT]: '0',
  [ItemStatName.LUK]: '0',
  [ItemStatName.CON]: '0',
  [ItemStatName.CUTE]: '0',
}

export interface RawItemMetadata {
  id: string
  image: string
  name: string
  description: string
  attributes: Attr[]
  details: {
    id: string
    labels: TraitLabel[]
    name: string
    rarity: TraitRarity
    relative_rarity_score: number
    base_rarity_score: number
    collection?: TraitCollection
    collection_name?: string
    equippable_gender: OttoGender
    equipped_count: number
    stats: Stat[]
    theme_boost: number
    type: ItemType
    wearable?: boolean
    product_factory?: string
    product_type?: string
    unreturnable?: boolean
  }
}

export interface ItemMetadata {
  tokenId: string // not unique, more like "type"
  type: ItemType // more like "category"
  name: string
  image: string
  rarity: TraitRarity
  description: string
  stats: ItemStats
  baseRarityScore: number
  relativeRarityScore: number
  totalRarityScore: number
  equippedCount: number
  equippableGender: OttoGender
  productFactory: string
  productType: string
  luck: number
  dex: number
  cute: number
  def: number
  str: number
  int: number
  con: number
  collection?: TraitCollection
  collectionName?: string
  themeBoost: number
  labels: TraitLabel[]
  unreturnable: boolean
  wearable: boolean
}

const parseNumericalStat = (val?: string): number => {
  const parsedVal = parseInt(val ?? '', 10)
  return isNaN(parsedVal) ? 0 : parsedVal
}

export const rawItemMetadataToItemMetadata = (raw: RawItemMetadata): ItemMetadata => {
  const stats = raw.details.stats.reduce(
    (map, stat) => {
      map[parseItemStatName(stat.name)] = stat.value
      return map
    },
    { ...defaultStats }
  )

  return {
    tokenId: raw.id,
    name: raw.name,
    image: raw.image,
    type: raw.details.type,
    rarity: raw.details.rarity,
    description: raw.description,
    stats,
    baseRarityScore: raw.details.base_rarity_score,
    relativeRarityScore: raw.details.relative_rarity_score,
    totalRarityScore: raw.details.base_rarity_score + raw.details.relative_rarity_score,
    equippedCount: raw.details.equipped_count,
    equippableGender: raw.details.equippable_gender,
    productFactory: raw.details.product_factory || '',
    productType: raw.details.product_type || '',
    luck: parseNumericalStat(stats.LUK),
    dex: parseNumericalStat(stats.DEX),
    cute: parseNumericalStat(stats.CUTE),
    def: parseNumericalStat(stats.DEF),
    str: parseNumericalStat(stats.STR),
    int: parseNumericalStat(stats.INT),
    con: parseNumericalStat(stats.CON),
    collection: raw.details.collection,
    collectionName: raw.details.collection_name,
    themeBoost: raw.details.theme_boost,
    labels: raw.details.labels,
    unreturnable: Boolean(raw.details.unreturnable),
    wearable: Boolean(raw.details.wearable),
  }
}

export interface Item {
  // from subgraph
  id: string // unique
  amount: number
  equippedBy?: string // otto's token id
  updatedAt: Date

  // from api
  metadata: ItemMetadata

  // only used in frontend
  unreturnable: boolean
}

export interface ItemAction {
  type: ItemActionType
  item_id: number
  from_otto_id: number
}
