import { ItemActionType } from 'constant'
import NonItem from './non-item.jpg'
import { Trait, Stat, TraitCollection, TraitRarity, OttoGender, TraitLabel } from './Otto'

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
