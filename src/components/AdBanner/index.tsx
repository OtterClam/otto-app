import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { useEffect, useState } from 'react'
import useApi from 'hooks/useApi'
import { Banner } from 'models/Banner'

const StyledLink = styled.a`
  display: flex !important;
`

export default function AdBanner({ showIndicators }: { showIndicators?: boolean }) {
  const [ads, setAds] = useState<Banner[]>([])
  const api = useApi()

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(setAds)
  }, [api])

  if (!ads.length) {
    return <div />
  }

  return (
    <Carousel
      interval={6000}
      showIndicators={showIndicators}
      showThumbs={false}
      showArrows={false}
      showStatus={false}
      autoPlay
      infiniteLoop
    >
      {ads.map(({ image, link }, i) => (
        <StyledLink key={i} href={link} target="_blank" style={{ display: 'block' }} rel="noreferrer">
          <Image unoptimized src={image} width={2000} height={500} />
        </StyledLink>
      ))}
    </Carousel>
  )
}
