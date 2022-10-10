import { Adventure, IOttoWearingFacet } from 'contracts/__generated__/Adventure'
import { intervalToDuration } from 'date-fns'
import { BigNumberish } from 'ethers'
import Item from './Item'

export enum LocationRewardType {
  Attr = 'attr',
  Item = 'item',
  Exp = 'exp',
  Tcp = 'tcp',
  Ap = 'ap',
}

export interface AdventureLocationReward {
  type: LocationRewardType
  min?: number
  max?: number
  fixed?: number
}

export enum BoostType {
  FirstMatchGroup = 'first_match_group',
  Legendary = 'legendary',
  Birthday = 'birthday',
  Zodiac = 'zodiac',
  LevelUp = 'level_up',
  Exp = 'exp', // only for front-end
}

export enum BoostConditionType {
  Base = 'base',
  And = 'and',
  Or = 'or',
}

export interface AttrBoostCondition {
  type: BoostConditionType.Base
  attr: string
  operator: '>'
  value: number
}

export interface NestedBoostCondition {
  type: BoostConditionType
  conditions: BoostCondition[]
}

export type BoostCondition = AttrBoostCondition | NestedBoostCondition

export interface BoostAmount {
  percentage: number
  value: number
}

export enum BoostTarget {
  SuccessRate = 'success_rate',
  AdditionalItem = 'additional_item',
  AdditionalArtwork = 'additional_artwork',
}

export interface BoostAmounts {
  // type of `k` must to be BoostTarget
  [k: string]: BoostAmount
}

export interface RawAdventureLocationConditionalBoost {
  type: BoostType
  condition: BoostCondition
  amounts: BoostAmounts
  effective: boolean
  effective_until?: string
}

export interface AdventureLocationConditionalBoost {
  type: BoostType
  condition: BoostCondition
  amounts: BoostAmounts
  effective: boolean
  effectiveUntil?: Date
}

export interface RawAdventureLocation {
  id: number
  name: string
  description: string
  success_rate: number
  adventure_time: string
  resting_time: string
  difficulty: number
  image: string
  bg_image: string
  bg_image_black: string
  map_position_x: number
  map_position_y: number
  success_rewards: AdventureLocationReward[]
  conditional_boosts: RawAdventureLocationConditionalBoost[]
  min_level: number
}

export interface AdventureLocation {
  id: number
  name: string
  description: string
  successRate: number
  adventureTime: Duration
  restingTime: Duration
  difficulty: number
  image: string
  bgImage: string
  bgImageBlack: string
  mapPositionX: number
  mapPositionY: number
  successRewards: {
    [k: string]: AdventureLocationReward
  }
  conditionalBoosts: AdventureLocationConditionalBoost[]
  minLevel: number
}

export type RawAdventureDepartureArgs = [
  BigNumberish, // otto id
  BigNumberish, // location id
  BigNumberish, // duration
  [
    BigNumberish, // typ
    BigNumberish, // itemId
    BigNumberish // fromOttoId
  ][], // actions
  [
    string, // nonce
    string, // digest
    string // signed
  ]
]

export type AdventureDepartureArgs = [
  BigNumberish, // otto id
  BigNumberish, // location id
  BigNumberish, // duration
  IOttoWearingFacet.ItemActionInputStruct[],
  Adventure.SignatureStruct
]

export type AdventureFinishArgs = [
  BigNumberish,
  BigNumberish,
  BigNumberish,
  IOttoWearingFacet.ItemActionInputStruct[],
  Adventure.SignatureStruct
]

export type AdventureJournalEntry = {
  happened_at: number
  text: string
}

export type AdventureResultReward = {
  items: Item[]
  exp: number
  tcp: number
  ap: number
}

export interface AdventureResult {
  success: boolean
  revived: boolean
  journal: AdventureJournalEntry[]
  rewards: AdventureResultReward
}

const parseDuration = (val: string): Duration => {
  const match = /^(\d+)h(\d+)m(\d+)s$/.exec(val)
  if (!match) {
    return intervalToDuration({ start: 0, end: 0 })
  }
  const h = Number(match[1])
  const m = Number(match[2])
  const s = Number(match[3])
  return intervalToDuration({ start: 0, end: h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000 })
}

function rawConditionalBoostToConditionalBoost(
  raw: RawAdventureLocationConditionalBoost
): AdventureLocationConditionalBoost {
  return {
    type: raw.type,
    condition: raw.condition,
    amounts: raw.amounts,
    effective: raw.effective,
    effectiveUntil: raw.effective_until ? new Date(raw.effective_until) : undefined,
  }
}

export function rawAdventureLocationToAdventureLocation(raw: RawAdventureLocation): AdventureLocation {
  const successRewards = (raw.success_rewards ?? []).reduce(
    (map, reward) => Object.assign(map, { [reward.type]: reward }),
    {} as { [k: string]: AdventureLocationReward }
  )
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    successRate: raw.success_rate,
    adventureTime: parseDuration(raw.adventure_time),
    restingTime: parseDuration(raw.resting_time),
    difficulty: raw.difficulty,
    image: raw.image,
    bgImage: raw.bg_image,
    bgImageBlack: raw.bg_image_black,
    mapPositionX: raw.map_position_x,
    mapPositionY: raw.map_position_y,
    successRewards,
    conditionalBoosts: raw.conditional_boosts.map(rawConditionalBoostToConditionalBoost),
    minLevel: raw.min_level,
  }
}
