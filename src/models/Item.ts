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
  base_rarity_score: number
  relative_rarity_score: number
  total_rarity_score: number
  equipped_count: number
  equippable_gender: string
  unreturnable: boolean
  isCoupon: boolean
  product_factory: string
  product_type: string
  update_at: number
}

export function traitToItem(trait: Trait): Item {
  return {
    id: '',
    description: '',
    amount: 1,
    equipped: false,
    isCoupon: false,
    product_factory: '',
    product_type: '',
    update_at: 0,
    ...trait,
  }
}

export const EmptyItem: Item = {
  id: '',
  name: '',
  image: NonItem.src,
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
  base_rarity_score: 0,
  relative_rarity_score: 0,
  total_rarity_score: 0,
  equipped_count: 0,
  equippable_gender: 'both',
  unreturnable: true,
  isCoupon: false,
  product_factory: '',
  product_type: '',
  update_at: 0,
}
