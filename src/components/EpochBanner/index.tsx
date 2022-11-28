import { useRouter } from 'next/router'
import { useBanners } from 'contexts/Banners'
import { BannerType } from 'models/Banner'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'
import Image from 'next/image'
import EpochInfo from './EpochInfo'

const StyledContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGray400};
  border-radius: 20px;
  overflow: hidden;
`

const BannerLink = styled.a`
  display: block;
  width: 100%;
  position: relative;

  &::before {
    content: '';
    display: block;
    padding-bottom: 25%;
  }
`

const BannerImageSkeleton = styled(Skeleton)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

export default function EpochBanner() {
  const { pathname } = useRouter()
  const banner = useBanners([BannerType.Leaderboard]).find(banner => banner.link === pathname)

  if (!banner) {
    return (
      <StyledContainer>
        <BannerLink as="div">
          <BannerImageSkeleton />
        </BannerLink>
        <EpochInfo />
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <Link href={banner.link} passHref>
        <BannerLink>
          <Image layout="fill" src={banner.image} />
        </BannerLink>
      </Link>
      <EpochInfo />
    </StyledContainer>
  )
}
