import assert from 'assert'

export enum DiceStatus {
  WaitingAnswer = 'waiting_anwser',
  Success = 'success',
  Pending = 'pending',
}

export enum EventType {
  Good = 'good',
  Bad = 'bad',
  Question = 'question',
}

export interface RawEvent {
  effect?: {
    brs: number
    ranking: number
  }
  questions?: string[]
}

export interface Event extends RawEvent {
  type: EventType
}

export interface RawDice {
  id: string
  status: string
  events: RawEvent[]
}

export class Dice {
  public readonly id: string

  public readonly status: DiceStatus

  public readonly events: Event[]

  constructor(raw: RawDice) {
    assert(Object.values(DiceStatus).includes(raw.status as DiceStatus), `unknown status: ${raw.status}`)
    this.id = raw.id
    this.status = raw.status as DiceStatus
    this.events = raw.events.map(rawEvent => ({
      ...rawEvent,
      type: rawEvent.effect ? (rawEvent.effect.brs > 0 ? EventType.Good : EventType.Bad) : EventType.Question,
    }))
  }
}
