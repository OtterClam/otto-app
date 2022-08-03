import groupBy from 'lodash/groupBy'
import leaderboardImage from './leaderboard.png'
import marketImage from './market.png'
import mineImage from './mine.png'
import mintImage from './mint.png'
import pondImage from './pond.png'
import storeImage from './store.png'
import adventureImage from './adventure.png'
import bankImage from './bank.png'

export interface Pin {
  key: string
  image: {
    src: string
    width: number
    height: number
  }
  link?: string
  layer: number
  // percentage
  position: {
    x: number
    y: number
  }
}

export const pins: Pin[] = [
  {
    layer: 1,
    key: 'leaderboard',
    image: leaderboardImage,
    link: '/leaderboard',
    position: {
      x: -6.8,
      y: 5.5,
    },
  },
  {
    layer: 1,
    key: 'market',
    image: marketImage,
    position: {
      x: 3,
      y: 33.5,
    },
  },
  {
    layer: 1,
    key: 'mine',
    image: mineImage,
    position: {
      x: 23,
      y: -2,
    },
  },
  {
    layer: 2,
    key: 'mint',
    image: mintImage,
    link: '/mint',
    position: {
      x: -6.8,
      y: 34,
    },
  },
  {
    layer: 2,
    key: 'pond',
    image: pondImage,
    link: '/treasury/pond',
    position: {
      x: -1,
      y: 21,
    },
  },
  {
    layer: 2,
    key: 'bank',
    image: bankImage,
    link: '/treasury/bank',
    position: {
      x: 20.5,
      y: 13,
    },
  },
  {
    layer: 3,
    key: 'store',
    image: storeImage,
    link: '/store',
    position: {
      x: 12.8,
      y: 17,
    },
  },
  {
    layer: 3,
    key: 'adventure',
    image: adventureImage,
    // link: '/adventure',
    position: {
      x: -4,
      y: -8.5,
    },
  },
]

export const layeredPins = groupBy(pins, pin => pin.layer)
