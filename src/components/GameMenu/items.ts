import itemsImage from './items.png'
import missionsImage from './missions.png'
import ottosImage from './ottos.png'
import portalsImage from './portals.png'
import treasuryImage from './treasury.png'

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
    image: portalsImage,
    link: '/my-portals',
  },
  {
    key: 'items',
    image: itemsImage,
    link: '/my-items',
  },
  {
    key: 'ottos',
    image: ottosImage,
    link: '/my-ottos',
  },
  {
    key: 'treasury',
    image: treasuryImage,
    link: '/treasury/dashboard',
  },
  {
    key: 'missions',
    image: missionsImage,
    link: '/missions',
  },
]
