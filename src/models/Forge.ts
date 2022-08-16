import Item, { rawItmeToItem, traitToItem } from './Item'
import { Trait } from './Otto'

export interface Forge {
  id: number
  result: Item
  materials: Item[]
  amounts: number[]
  title: string
  description: string
  startTime: Date
  endTime: Date
}

export interface RawForge {
  id: number
  result: Trait
  materials: Trait[]
  amounts: number[]
  title: string
  description: string
  start_time: Date
  end_time: Date
}

export const rawForgeToForge = (raw: RawForge): Forge => {
  return {
    id: raw.id,
    result: rawItmeToItem('', raw.result),
    materials: raw.materials.map(rawItem => rawItmeToItem('', rawItem)),
    amounts: raw.amounts,
    title: raw.title,
    description: raw.description,
    startTime: new Date(raw.start_time),
    endTime: new Date(raw.end_time),
  }
}
