export enum AdventureOttoStatus {
  Finished = 'finished',
  Ongoing = 'ongoing',
  Resting = 'resting',
  Ready = 'ready',
  Unavailable = 'unavailable',
}

export interface RawAdventurePass {
  location_id: number
  finished_tx?: string
  departured_at: string
  can_finished_at: string
  finished_at?: string
}

export interface RawAdventureOtto {
  id: number
  name: string
  image: string
  image_wo_bg: string
  adventure_status: AdventureOttoStatus
  resting_until?: string
  level: number
  latest_adventure_pass: RawAdventurePass
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
  latestAdventurePass?: AdventurePass
}

export interface AdventurePass {
  locationId: number
  finishedAt?: Date
  finishedTx?: string
  departuredAt: Date
  canFinishedAt: Date
}

export const rawAdventureOttoToAdventureOtto = (raw: RawAdventureOtto): AdventureOtto => {
  if (!Object.values(AdventureOttoStatus).includes(raw.adventure_status)) {
    throw new Error(`unknown status: ${raw.adventure_status}`)
  }
  const latestAdventurePass = raw.latest_adventure_pass
    ? {
        finishedTx: raw.latest_adventure_pass.finished_tx,
        locationId: raw.latest_adventure_pass.location_id,
        departuredAt: new Date(raw.latest_adventure_pass.departured_at),
        finishedAt: raw.latest_adventure_pass.finished_at ? new Date(raw.latest_adventure_pass.finished_at) : undefined,
        canFinishedAt: new Date(raw.latest_adventure_pass.can_finished_at),
      }
    : undefined
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
    imageWoBg: raw.image_wo_bg,
    status: raw.adventure_status,
    restingUntil: raw.resting_until ? new Date(raw.resting_until) : undefined,
    level: raw.level,
    latestAdventurePass,
  }
}
