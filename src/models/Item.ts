import NonItem from './non-item.jpg'

export interface ItemAttr {
  name: string
  value: number
}

export default interface Item {
  id: string
  name: string
  type: string
  wearable: boolean
  image: string
  rarity: string
  description: string
  attrs: ItemAttr[]
  equipped: boolean
  amount: number
  parentTokenId?: string
  baseRarityScore: number
}

export const EmptyItem: Item = {
  id: '',
  name: '',
  image: NonItem,
  type: '',
  wearable: true,
  rarity: 'C3',
  description: '',
  attrs: [
    { name: 'STR', value: 0 },
    { name: 'DEF', value: 0 },
    { name: 'DEX', value: 0 },
    { name: 'INT', value: 0 },
    { name: 'LUK', value: 0 },
    { name: 'CON', value: 0 },
    { name: 'CUTE', value: 0 },
  ],
  equipped: false,
  amount: 0,
  baseRarityScore: 0,
}
