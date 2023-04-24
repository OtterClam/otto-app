import ImageButton from 'components/ImageButton'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'

const pinIcons = [
  { src: '/images/map/adventure.png' },
  { src: '/images/map/bank.png' },
  { src: '/images/map/leaderboard.png' },
  { src: '/images/map/market.png' },
  { src: '/images/map/mine.png' },
  { src: '/images/map/mint.png' },
  { src: '/images/map/palace.png' },
  { src: '/images/map/pond.png' },
  { src: '/images/map/store.png' },
  { src: '/images/map/foundry.png' },
].map(image => ({ ...image, width: 600, height: 220 }))

const [
  adventureImage,
  bankImage,
  leaderboardImage,
  marketImage,
  mineImage,
  mintImage,
  palaceImage,
  pondImage,
  storeImage,
  foundryImage,
] = pinIcons

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
    link: '/adventure',
    position: {
      x: -9.3,
      y: -13.8,
    },
  },
  {
    key: 'palace',
    image: palaceImage,
    link: 'https://warm-egg-c0e.notion.site/64952dfd28ee4aee85a1c837af30f71d?v=251e24cda631430992c183fba21ed185',
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
      target={(pin.link ?? '').startsWith('https://') ? '_blank' : undefined}
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
