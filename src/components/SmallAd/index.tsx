import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import adImage from './ad.png'

const StyledContainer = styled.a`
  display: inline-block;
`

export default function SmallAd({ className }: { className?: string }) {
  return (
    <Link href="http://google.com" passHref>
      <StyledContainer className={className}>
        <Image unoptimized src={adImage} width={adImage.width / 2} height={adImage.height / 2} />
      </StyledContainer>
    </Link>
  )
}
