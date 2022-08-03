import { BundleName } from '../consts'
import { GeneralAssetsBundle } from './bundle'

export const home = new GeneralAssetsBundle(BundleName.HomePage, [
  'src/views/home/icons/portal-large.png',
  'src/views/home/icons/portal.png',
  'src/views/home/icons/buy-clam.png',
  'src/views/home/icons/treasury.png',
  'src/views/home/icons/dao.png',
  'src/views/home/icons/whitepaper.png',
  'src/views/home/icons/join-discord.png',
])
