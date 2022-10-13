import { RawAdventurePass } from 'libs/RawAdventureResult'

export interface AdventurePass {
  locationId: number
  finishedAt?: Date
  finishedTx?: string
  departureAt: Date
  canFinishAt: Date
}

export function fromRawPass(raw: RawAdventurePass): AdventurePass {
  return {
    finishedTx: raw.finished_tx,
    locationId: raw.location_id,
    departureAt: new Date(raw.departure_at),
    finishedAt: raw.finished_at ? new Date(raw.finished_at) : undefined,
    canFinishAt: new Date(raw.can_finish_at),
  }
}
