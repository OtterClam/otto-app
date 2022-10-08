import omit from 'lodash/omit'
import { RawAdventureLocation, rawAdventureLocationToAdventureLocation, AdventureLocation } from './AdventureLocation'
import { OttoMeta } from './Otto'

export interface RawAdventurePreview extends OttoMeta {
  location: RawAdventureLocation
}

export interface AdventurePreview extends OttoMeta {
  location: AdventureLocation
}

export function rawAdventurePreviewToAdventurePreview(raw: RawAdventurePreview): AdventurePreview {
  return {
    ...omit(raw, 'location'),
    location: rawAdventureLocationToAdventureLocation(raw.location),
  }
}
