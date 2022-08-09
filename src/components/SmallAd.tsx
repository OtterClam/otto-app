import { Banner, BannerType } from 'models/Banner'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.a`
  display: inline-flex;
  border: 2px ${({ theme }) => theme.colors.white} solid;
`

export default function SmallAd({ className }: { className?: string }) {
  const [ad, setAd] = useState<Banner>()

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => data.find(({ type }: Banner) => type === BannerType.HomePageSmallAd))
      .then(setAd)
  }, [])

  // suspense
  if (!ad) {
    return <div />
  }

  return (
    <Link href={ad.link} passHref>
      <StyledContainer className={className}>
        {ad && <Image unoptimized src={ad.image} width={200} height={100} />}
      </StyledContainer>
    </Link>
  )
}
