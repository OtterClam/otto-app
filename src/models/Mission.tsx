import { Item, RawItemMetadata } from './Item'

export type MissionLevel = 'S' | 'A' | 'B' | 'C' | 'D'

export type MissionStatus = 'ongoing' | 'finished'

export interface MissionRequirement {
  item: Item
  amount: number
}

export type MissionReward = MissionFishReward | MissionItemReward

export interface MissionFishReward {
  type: 'fish'
  decimal: number
  amount: string
}

export interface MissionItemReward {
  type: 'item'
  item: Item
  amount: number
}

export interface Mission {
  id: number
  name: string
  description: string
  response: string
  level: MissionLevel
  status: MissionStatus
  requirements: MissionRequirement[]
  rewards: MissionReward[]
}

export interface NewMissionInfo {
  nextFreeMissionAt: Date
  price: string
}
