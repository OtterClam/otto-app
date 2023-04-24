import { BasicAssetsBundle } from './bundle'
import { BundleName } from '../consts'

export const basic = new BasicAssetsBundle(BundleName.Basic, [
  // global
  'https://cdn.jsdelivr.net/gh/max32002/naikaifont@1.0/webfont/NaikaiFont-Regular-Lite.woff2',
  '/fonts/Pangolin-Regular.ttf',
  '/fonts/pangolin-regular.woff2',
  '/fonts/PaytoneOne-Regular.ttf',
  '/fonts/paytoneone-regular.woff2',
  '/ottoclick.mp3',

  // header
  '/images/header/logo-small.png',
  '/images/header/logo-large.png',
  '/images/header/large-fish.png',
  '/images/header/small-fish.png',
  '/images/header/plus.png',
  '/images/header/background.png',
  '/images/header/large-button.png',
  '/images/header/small-button.png',
  '/images/header/large-edge.png',
  '/images/header/large-right.png',
  '/images/header/small-right.png',
  '/images/header/large-btn-edge.png',
  '/images/header/small-btn-edge.png',
  '/images/header/small-edge.png',
  '/images/header/large-btn-center.png',
  '/images/header/small-btn-center.png',
  '/images/header/small-center-wallet.png',
  '/images/header/large-center-wallet.png',
  '/images/header/small-center.png',

  // loading images
  '/otto-loading.jpg',
])
