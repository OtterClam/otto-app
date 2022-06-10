export enum EventType {
  Good = 'good',
  Bad = 'bad',
  Question = 'question',
}

export interface RawEvent {
  event: string
  question?: string
  options?: string[]
  effects?: {
    brs: number
    ranking: number
  }
}

export interface Event extends RawEvent {
  type: EventType
}

export interface RawDice {
  tx: string
  events: RawEvent[]
}

export class Dice {
  public readonly tx: string

  public readonly events: Event[]

  constructor(raw: RawDice) {
    this.tx = raw.tx
    this.events = raw.events.map(rawEvent => ({
      ...rawEvent,
      type: rawEvent.effects ? (rawEvent.effects.brs > 0 ? EventType.Good : EventType.Bad) : EventType.Question,
    }))
  }
}
