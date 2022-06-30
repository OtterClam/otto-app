import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import styled from 'styled-components/macro'
import Ad0526 from './ad-0526.jpg'
import Ad0509 from './ad-0509.jpg'
import Ad0510 from './ad-0510.jpg'
import Ad0511 from './ad-0511.jpg'

const ads = [
  {
    image: Ad0509,
    link: 'https://ottopia.app/leaderboard',
  },
  {
    image: Ad0510,
    link: 'https://ottopia.app/store',
  },
  {
    image: Ad0526,
    link: 'https://www.youtube.com/watch?v=ztkYjsmNqjY',
  },
  {
    image: Ad0511,
    link: 'https://www.youtube.com/watch?v=xIgPCJZuPfU',
  },
]

const StyledLink = styled.a`
  display: flex !important;
`

export default function AdBanner() {
  return (
    <Carousel interval={6000} showThumbs={false} showArrows={false} showStatus={false} autoPlay infiniteLoop>
      {ads.map(({ image, link }, i) => (
        <StyledLink key={i} href={link} target="_blank" style={{ display: 'block' }} rel="noreferrer">
          <Image unoptimized src={image} />
        </StyledLink>
      ))}
    </Carousel>
  )
}
