export enum AdventureOttoStatus {
  Finished = 'finished',
  Ongoing = 'ongoing',
  Resting = 'resting',
  Ready = 'ready',
  Unavailable = 'unavailable',
}

export interface RawAdventureOtto {
  id: number
  name: string
  image: string
  image_wo_bg: string
  status: AdventureOttoStatus
  departured_at?: string
  can_finished_at?: string
  finished_at?: string
  resting_until?: string
  location_id?: number
  level: number
  finished_tx?: string
}

export interface AdventureOtto {
  id: number
  name: string
  image: string
  imageWoBg: string
  status: AdventureOttoStatus
  departuredAt?: Date
  finishedAt?: Date
  canFinishedAt?: Date
  restingUntil?: Date
  locationId?: number
  level: number
  finishedTx?: string
}

export const rawAdventureOttoToAdventureOtto = (raw: RawAdventureOtto): AdventureOtto => {
  if (!Object.values(AdventureOttoStatus).includes(raw.status)) {
    throw new Error(`unknown status: ${raw.status}`)
  }
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
    imageWoBg: raw.image_wo_bg,
    status: raw.status,
    departuredAt: raw.departured_at ? new Date(raw.departured_at) : undefined,
    finishedAt: raw.finished_at ? new Date(raw.finished_at) : undefined,
    canFinishedAt: raw.can_finished_at ? new Date(raw.can_finished_at) : undefined,
    restingUntil: raw.resting_until ? new Date(raw.resting_until) : undefined,
    locationId: raw.location_id,
    level: raw.level,
    finishedTx: raw.finished_tx,
  }
}
