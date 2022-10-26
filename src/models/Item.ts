import { ItemActionType } from 'constant'
import NonItem from './non-item.jpg'
import { Trait, TraitCollection, TraitRarity, OttoGender, TraitLabel, Attr, Stat } from './Otto'

export enum ItemType {
  Holding = 'Holding',
  Headwear = 'Headwear',
  FacialAccessories = 'Facial Accessories',
  Clothes = 'Clothes',
  Background = 'Background',
  Coupon = 'Coupon',
  MissionItem = 'Mission Item',
  Other = 'Other',
}

export const defaultStats = {
  STR: '0',
  DEF: '0',
  DEX: '0',
  INT: '0',
  LUK: '0',
  CON: '0',
  CUTE: '0',
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
    product_factory: string
    product_type: string
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
  stats: {
    [k: string]: string
  }
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
  const stats = raw.details.stats.reduce((map, stat) => {
    map[stat.name] = stat.value
    return map
  }, {} as { [k: string]: string })

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
    productFactory: raw.details.product_factory,
    productType: raw.details.product_type,
    luck: parseNumericalStat(stats.LUCK),
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

export interface NewItem {
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

export interface ItemStat {
  name: string
  value: string
}

export default interface Item {
  tokenId: string
  name: string
  type: string
  wearable: boolean
  image: string
  rarity: TraitRarity
  description: string
  stats: Stat[]
  equipped: boolean
  amount: number
  parentTokenId?: string
  base_rarity_score: number
  relative_rarity_score: number
  total_rarity_score: number
  equipped_count: number
  equippable_gender: OttoGender
  unreturnable: boolean
  isCoupon: boolean
  isMissionItem: boolean
  product_factory: string
  product_type: string
  luck: number
  dex: number
  cute: number
  def: number
  str: number
  int: number
  con: number
  update_at: number
  collection?: TraitCollection
  collection_name?: string
  theme_boost: number
  labels: TraitLabel[]
}

export function traitToItem(trait: Trait): Item {
  return {
    description: '',
    amount: 1,
    equipped: false,
    isCoupon: false,
    isMissionItem: false,
    product_factory: '',
    product_type: '',
    update_at: 0,
    luck: Number(trait.stats.find(s => s.name === 'LUK')?.value ?? 0),
    dex: Number(trait.stats.find(s => s.name === 'DEX')?.value ?? 0),
    cute: Number(trait.stats.find(s => s.name === 'CUTE')?.value ?? 0),
    def: Number(trait.stats.find(s => s.name === 'DEF')?.value ?? 0),
    str: Number(trait.stats.find(s => s.name === 'STR')?.value ?? 0),
    int: Number(trait.stats.find(s => s.name === 'INT')?.value ?? 0),
    con: Number(trait.stats.find(s => s.name === 'CON')?.value ?? 0),
    tokenId: trait.id,
    ...trait,
  }
}

export function rawItemToItem(id: string, { id: traiId, name, description, image, details }: any): Item {
  return {
    tokenId: id || traiId,
    name,
    description,
    image,
    equipped: false,
    amount: 1,
    unreturnable: false,
    isCoupon: details.type === 'Coupon',
    isMissionItem: details.type === 'Mission Item',
    total_rarity_score: details.base_rarity_score + details.relative_rarity_score,
    luck: Number(details.stats.find((s: any) => s.name === 'LUK').value) || 0,
    dex: Number(details.stats.find((s: any) => s.name === 'DEX').value) || 0,
    cute: Number(details.stats.find((s: any) => s.name === 'CUTE').value) || 0,
    def: Number(details.stats.find((s: any) => s.name === 'DEF').value) || 0,
    str: Number(details.stats.find((s: any) => s.name === 'STR').value) || 0,
    int: Number(details.stats.find((s: any) => s.name === 'INT').value) || 0,
    con: Number(details.stats.find((s: any) => s.name === 'CON').value) || 0,
    ...details,
  }
}

export const EmptyItem: Item = {
  tokenId: '',
  name: '',
  image: NonItem.src,
  type: '',
  wearable: true,
  rarity: TraitRarity.C3,
  description: '',
  stats: [
    { name: 'STR', value: '0' },
    { name: 'DEF', value: '0' },
    { name: 'DEX', value: '0' },
    { name: 'INT', value: '0' },
    { name: 'LUK', value: '0' },
    { name: 'CON', value: '0' },
    { name: 'CUTE', value: '0' },
  ],
  equipped: false,
  amount: 1,
  base_rarity_score: 0,
  relative_rarity_score: 0,
  total_rarity_score: 0,
  equipped_count: 0,
  equippable_gender: OttoGender.Both,
  unreturnable: true,
  isCoupon: false,
  isMissionItem: false,
  product_factory: '',
  product_type: '',
  update_at: 0,
  luck: 0,
  dex: 0,
  cute: 0,
  def: 0,
  str: 0,
  int: 0,
  con: 0,
  collection: TraitCollection.Genesis,
  collection_name: '',
  theme_boost: 0,
  labels: [],
}

export interface ItemAction {
  type: ItemActionType
  item_id: number
  from_otto_id: number
}
