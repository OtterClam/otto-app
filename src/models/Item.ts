import NonItem from './non-item.jpg'
import { Trait } from './Otto'

export interface ItemStat {
  name: string
  value: string
}

export default interface Item {
  id: string
  name: string
  type: string
  wearable: boolean
  image: string
  rarity: string
  description: string
  stats: ItemStat[]
  equipped: boolean
  amount: number
  parentTokenId?: string
  baseRarityScore: number
  equippable_gender: string
  unreturnable: boolean
}

export function traitToItem(trait: Trait): Item {
  return {
    ...trait,
    id: '',
    description: '',
    equipped: false,
    amount: 1,
    baseRarityScore: trait.base_rarity_score,
  }
}

export const EmptyItem: Item = {
  id: '',
  name: '',
  image: NonItem,
  type: '',
  wearable: true,
  rarity: 'C3',
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
  baseRarityScore: 0,
  equippable_gender: 'both',
  unreturnable: true,
}
