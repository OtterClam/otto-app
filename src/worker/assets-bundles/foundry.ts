import { BundleName } from '../consts'
import { GeneralAssetsBundle } from './bundle'

export const foundry = new GeneralAssetsBundle(BundleName.FoundryPage, [
  '/images/foundry/foundry_bg.jpg',
  '/images/foundry/foundry_fg.png',
  '/images/foundry/otto_smith.png',
  '/images/foundry/arrow.svg',
])
