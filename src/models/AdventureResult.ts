import { RawAdventureResult } from 'libs/RawAdventureResult'
import { AdventurePass, fromRawPass } from './AdventurePass'
import Item, { ItemMetadata, rawItemMetadataToItemMetadata, rawItemToItem } from './Item'

export interface AdventureResult {
  success: boolean
  revived: boolean
  restingUntil: Date
  journal: AdventureJournalEntry[]
  rewards: AdventureResultReward
  events: AdventureResultEvents
  pass: AdventurePass
}

export type AdventureResultEvents = {
  level_up?: {
    from: {
      level: number
      exp: number
      expToNextLevel: number
    }
    to: {
      level: number
      exp: number
      expToNextLevel: number
    }
    got: {
      items: Item[]
      attrs_points: number
    }
  }
}

export type AdventureJournalEntry = {
  happened_at: number
  text: string
}

export type AdventureResultReward = {
  items: ItemMetadata[]
  exp: number
  tcp: number
  ap: number
}

export function fromRawResult(raw: RawAdventureResult): AdventureResult {
  return {
    success: raw.success,
    revived: raw.revived,
    restingUntil: new Date(raw.resting_until),
    journal: raw.journal.map(e => ({
      happened_at: e.happened_at,
      text: e.text,
    })),
    rewards: {
      items: raw.rewards.items.map(raw => rawItemMetadataToItemMetadata(raw)),
      exp: raw.rewards.exp,
      tcp: raw.rewards.tcp,
      ap: raw.rewards.ap,
    },
    events: {
      level_up: raw.events?.level_up && {
        from: {
          level: raw.events.level_up.from.level,
          exp: raw.events.level_up.from.exp,
          expToNextLevel: raw.events.level_up.from.expToNextLevel,
        },
        to: {
          level: raw.events.level_up.to.level,
          exp: raw.events.level_up.to.exp,
          expToNextLevel: raw.events.level_up.to.expToNextLevel,
        },
        got: {
          items: raw.events.level_up.got.items.map(i => rawItemToItem(i.id, i)),
          attrs_points: raw.events.level_up.got.attrs_points,
        },
      },
    },
    pass: fromRawPass(raw.pass),
  }
}
