import largeItemsImage from './large-items.png'
import largeMissionsImage from './large-missions.png'
import largeOttosImage from './large-ottos.png'
import largePortalsImage from './large-portals.png'
import largeTreasuryImage from './large-treasury.png'

export interface Item {
  key: string
  image: {
    src: string
    width: number
    height: number
  }
  link: string
}

export const items = [
  {
    key: 'portals',
    image: largePortalsImage,
    link: '/my-portals',
  },
  {
    key: 'items',
    image: largeItemsImage,
    link: '/my-items',
  },
  {
    key: 'ottos',
    image: largeOttosImage,
    link: '/my-ottos',
  },
  {
    key: 'treasury',
    image: largeTreasuryImage,
    link: '/treasury/dashboard',
  },
  {
    key: 'missions',
    image: largeMissionsImage,
    link: '/missions',
  },
]
