import omit from 'lodash/omit'
import { RawAdventureLocation, rawAdventureLocationToAdventureLocation, AdventureLocation } from './AdventureLocation'
import { RawOtto } from './Otto'

export interface RawAdventurePreview extends RawOtto {
  location?: RawAdventureLocation
}

export interface AdventurePreview extends RawOtto {
  location?: AdventureLocation
}

export function rawAdventurePreviewToAdventurePreview(raw: RawAdventurePreview): AdventurePreview {
  return {
    ...omit(raw, 'location'),
    location: raw.location ? rawAdventureLocationToAdventureLocation(raw.location) : undefined,
  }
}
