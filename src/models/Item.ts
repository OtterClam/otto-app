export interface ItemAttr {
  type: string
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
  attrs: ItemAttr[]
}
