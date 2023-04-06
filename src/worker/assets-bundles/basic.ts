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
  'src/components/PageHeader/Logo/logo-small.png',
  'src/components/PageHeader/Logo/logo-large.png',
  'src/components/PageHeader/Balance/large-fish.png',
  'src/components/PageHeader/Balance/small-fish.png',
  'src/components/PageHeader/Balance/plus.png',
  'src/components/PageHeader/MenuButton/background.png',
  'src/components/PageHeader/Title/large-button.png',
  'src/components/PageHeader/Title/small-button.png',
  'src/components/PageHeader/Wallet/large-edge.png',
  'src/components/PageHeader/Title/large-right.png',
  'src/components/PageHeader/Title/small-right.png',
  'src/components/PageHeader/Wallet/large-btn-edge.png',
  'src/components/PageHeader/Wallet/small-btn-edge.png',
  'src/components/PageHeader/Wallet/small-edge.png',
  'src/components/PageHeader/Wallet/large-btn-center.png',
  'src/components/PageHeader/Wallet/small-btn-center.png',
  'src/components/PageHeader/Wallet/small-center.png',
  'src/components/PageHeader/Wallet/large-center.png',
  'src/components/PageHeader/Title/small-center.png',

  // loading images
  '/otto-loading.jpg',
])
