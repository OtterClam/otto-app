export interface Journal {
  happened_at: any
  text: string
}

export interface Rewards {
  items: any[]
  exp: number
  tcp: number
  ap: number
}

export interface RawAdventurePass {
  location_id: number
  departure_at: Date
  can_finish_at: Date
  finished_at?: Date
  finished_tx?: string
}

export interface From {
  level: number
  exp: number
  expToNextLevel: number
}

export interface To {
  level: number
  exp: number
  expToNextLevel: number
}

export interface Got {
  attrs_points: number
  items: any[]
}

export interface LevelUp {
  from: From
  to: To
  got: Got
}

export interface Events {
  level_up?: LevelUp
}

export interface RawAdventureResult {
  otto_id: string
  resting_until: Date
  success: boolean
  revived: boolean
  journal: Journal[]
  rewards: Rewards
  pass: RawAdventurePass
  events: Events
}
