import { useBanners } from 'contexts/Banners'
import { BannerType } from 'models/Banner'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'
import EpochInfo from './EpochInfo'

const StyledContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGray400};
  border-radius: 20px;
  overflow: hidden;
`

const BannerImage = styled.a<{ bg?: string }>`
  width: 100%;
  position: relative;

  ${({ bg }) =>
    bg &&
    `
    background: center / cover url(${bg});
  `}

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
  const banner = useBanners([BannerType.LeaderboardMain])[0]

  if (!banner) {
    return (
      <StyledContainer>
        <BannerImage as="div">
          <BannerImageSkeleton />
        </BannerImage>
        <EpochInfo />
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <Link href={banner.link} passHref>
        <BannerImage bg={banner.image} />
      </Link>
      <EpochInfo />
    </StyledContainer>
  )
}
