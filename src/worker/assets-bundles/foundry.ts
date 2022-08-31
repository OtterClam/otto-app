import { BundleName } from '../consts'
import { GeneralAssetsBundle } from './bundle'

export const foundry = new GeneralAssetsBundle(BundleName.FoundryPage, [
  'src/views/foundry/FoundryHero/foundry_bg.jpg',
  'src/views/foundry/FoundryHero/foundry_fg1.png',
  'src/views/foundry/FoundryHero/foundry_fg2.png',
  'src/views/foundry/FoundryHero/otto_smith1.png',
  'src/views/foundry/FoundryHero/otto_smith2.png',
])
