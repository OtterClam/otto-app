import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import styled from 'styled-components/macro'
import KawaiiChest from './kawaii_chest.jpg'
import JulyAMA from './otterking_ama_july2022.jpg'
import StakingV2 from './staking_v2.jpg'
import RarityEpoch5 from './5th_epoch_rarity_contest.jpg'
import RarityEpoch4Winners from './4th_epoch_rarity_winners.jpg'
import ClamPond from './clam_pond.jpg'
import PearlBank from './pearl_bank.jpg'

const ads = [
  {
    image: KawaiiChest,
    link: 'https://ottopia.app/store',
  },
  {
    image: StakingV2,
    link: 'https://medium.com/@otterclam/introducing-clam-pond-and-pearl-bank-ce7a9fa46407',
  },
  {
    image: RarityEpoch5,
    link: 'https://ottopia.app/leaderboard',
  },
  {
    image: RarityEpoch4Winners,
    link: 'https://ottopia.app/leaderboard?epoch=3',
  },
  {
    image: ClamPond,
    link: 'https://ottopia.app/treasury/pond',
  },
  {
    image: PearlBank,
    link: 'https://ottopia.app/treasury/bank',
  },
  //TODO
  {
    image: JulyAMA,
    link: '',
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
