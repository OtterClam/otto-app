import { useBanners } from 'contexts/Banners'
import { Banner, BannerType } from 'models/Banner'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.a`
  display: inline-flex;
  border: 2px ${({ theme }) => theme.colors.white} solid;
`

const newTabProps = {
  target: '_blank',
  rel: 'noreferrer',
}

export default function SmallAd({ className }: { className?: string }) {
  const banners = useBanners([BannerType.HomePageSmallAd])
  const ad = banners[0]

  // suspense
  if (!ad) {
    return <div />
  }

  return (
    <Link href={ad.link} passHref>
      <StyledContainer className={className} {...(ad.openNewTab ? newTabProps : {})}>
        {ad && <Image unoptimized src={ad.image} width={200} height={100} />}
      </StyledContainer>
    </Link>
  )
}
