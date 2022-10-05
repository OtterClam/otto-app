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
      x: -12.4,
      y: 0,
    },
  },
  {
    key: 'market',
    image: marketImage,
    position: {
      x: -2.7,
      y: 25,
    },
  },
  {
    key: 'mine',
    image: mineImage,
    position: {
      x: 16.3,
      y: -7.6,
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
      x: -7,
      y: 13.6,
    },
  },
  {
    key: 'bank',
    image: bankImage,
    link: '/treasury/bank',
    position: {
      x: 14.4,
      y: 6,
    },
  },
  {
    key: 'store',
    image: storeImage,
    link: '/store',
    position: {
      x: 6.6,
      y: 9.8,
    },
  },
  {
    key: 'adventure',
    image: adventureImage,
    // link: '/adventure',
    position: {
      x: -9.3,
      y: -13.8,
    },
  },
  {
    key: 'palace',
    image: palaceImage,
    link: '/treasury/dashboard',
    position: {
      x: 1.35,
      y: -11,
    },
  },
  {
    key: 'foundry',
    image: foundryImage,
    link: '/foundry',
    position: {
      x: 6,
      y: 24,
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
