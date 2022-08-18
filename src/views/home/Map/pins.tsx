import ImageButton from 'components/ImageButton'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import adventureImage from './adventure.png'
import bankImage from './bank.png'
import leaderboardImage from './leaderboard.png'
import marketImage from './market.png'
import mineImage from './mine.png'
import mintImage from './mint.png'
import palaceImage from './palace.png'
import pondImage from './pond.png'
import storeImage from './store.png'
import foundryImage from './foundry.png'

export interface PinData {
  key: string
  image: {
    src: string
    width: number
    height: number
  }
  link?: string
  // percentage
  position: {
    x: number
    y: number
  }
}

export const pins: PinData[] = [
  {
    key: 'leaderboard',
    image: leaderboardImage,
    link: '/leaderboard',
    position: {
      x: -11.4,
      y: -3,
    },
  },
  {
    key: 'market',
    image: marketImage,
    position: {
      x: -1,
      y: 24.6,
    },
  },
  {
    key: 'mine',
    image: mineImage,
    position: {
      x: 16.3,
      y: -10.6,
    },
  },
  {
    key: 'mint',
    image: mintImage,
    link: '/mint',
    position: {
      x: -11.8,
      y: 25,
    },
  },
  {
    key: 'pond',
    image: pondImage,
    link: '/treasury/pond',
    position: {
      x: -5.7,
      y: 11,
    },
  },
  {
    key: 'bank',
    image: bankImage,
    link: '/treasury/bank',
    position: {
      x: 16.8,
      y: 3.8,
    },
  },
  {
    key: 'store',
    image: storeImage,
    link: '/store',
    position: {
      x: 8.6,
      y: 7.6,
    },
  },
  {
    key: 'adventure',
    image: adventureImage,
    // link: '/adventure',
    position: {
      x: -8.5,
      y: -17.8,
    },
  },
  {
    key: 'palace',
    image: palaceImage,
    link: '/treasury/dashboard',
    position: {
      x: 3,
      y: -14.7,
    },
  },
  {
    key: 'foundry',
    image: foundryImage,
    link: '/foundry',
    position: {
      x: 8,
      y: 22,
    },
  },
]

const buttonStates = ['default', ':hover', '[data-disabled="true"]']

const StyledLabel = styled(Caption)<{ scale: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ scale }) => scale * 28}px;
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 10px;
  }
`

export function Pin({ pin, width, className }: { pin: PinData; width: number; className?: string }) {
  const { t } = useTranslation('', { keyPrefix: 'home.pins' })
  const scale = width / (pin.image.width / 3)

  const button = (
    <ImageButton
      as="a"
      data-disabled={!pin.link}
      className={className}
      states={buttonStates}
      image={pin.image}
      scale={scale}
    >
      <StyledLabel scale={scale}>{t(pin.key)}</StyledLabel>
    </ImageButton>
  )
  if (!pin.link) {
    return button
  }
  return (
    <Link href={pin.link} passHref>
      {button}
    </Link>
  )
}
