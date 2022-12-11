import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { BannerType } from 'models/Banner'
import { useBanners } from 'contexts/Banners'

const StyledLink = styled.a`
  display: flex !important;
`

const newTabProps = {
  target: '_blank',
  rel: 'noreferrer',
}

export default function AdBanner({ showIndicators }: { showIndicators?: boolean }) {
  const ads = useBanners([BannerType.AdBanner])

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
      {ads.map(({ image, link, openNewTab }, i) => (
        <StyledLink key={i} href={link} style={{ display: 'block' }} {...(openNewTab ? newTabProps : {})}>
          <Image unoptimized src={image} width={2000} height={500} />
        </StyledLink>
      ))}
    </Carousel>
  )
}
