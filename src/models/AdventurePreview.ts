import omit from 'lodash/omit'
import { RawAdventureLocation, rawAdventureLocationToAdventureLocation, AdventureLocation } from './AdventureLocation'
import { OttoMeta } from './Otto'

export interface RawAdventurePreview extends OttoMeta {
  location: RawAdventureLocation
}

export interface AdventurePrevew extends OttoMeta {
  location: AdventureLocation
}

export function rawAdventurePreviewToAdventurePrevew(raw: RawAdventurePreview): AdventurePrevew {
  return {
    ...omit(raw, 'location'),
    location: rawAdventureLocationToAdventureLocation(raw.location),
  }
}
