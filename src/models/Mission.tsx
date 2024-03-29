import { Item, RawItemMetadata, rawItemMetadataToItemMetadata } from './Item'

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

export interface MissionInfo {
  new_matic_payment_key: string
  new_matic_price: string
  nextFreeMissionAt: Date
  newPrice: string
  newProductId: string
  refresh_matic_payment_key: string
  refresh_matic_price: string
  refreshPrice: string
  refreshProductId: string
}

export function rawMissionToMission(raw: any): Mission {
  return {
    ...raw,
    requirements: raw.requirements.map((r: any) => ({
      ...r,
      item: {
        id: r.item.id,
        amount: 1,
        updatedAt: new Date(),
        metadata: rawItemMetadataToItemMetadata(r.item),
      },
    })),
    rewards: raw.rewards.map((r: any) =>
      r.type === 'item'
        ? {
            ...r,
            item: {
              id: r.item.id,
              amount: 1,
              updatedAt: new Date(),
              metadata: rawItemMetadataToItemMetadata(r.item),
            },
          }
        : r
    ),
  }
}
