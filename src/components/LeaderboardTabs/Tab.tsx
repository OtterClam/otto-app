import { useBreakpoints } from 'contexts/Breakpoints'
import { Banner } from 'models/Banner'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components/macro'

const StyledButton = styled.a`
  background: ${({ theme }) => theme.colors.darkGray100};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 20px;
  line-height: 0;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray300};
  }

  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.crownYellow};
    box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.crownYellow};
  }
`

const StyledImageContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.darkGray100};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 14px;
  width: 438px;
  height: 113px;
  margin: 5px;
  overflow: hidden;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 156px;
    height: 48px;
  }
`

export default function LeaderboardTab({ banner }: { banner: Banner }) {
  const { pathname } = useRouter()
  const { isMobile } = useBreakpoints()

  return (
    <Link href={banner.link} passHref>
      <StyledButton data-active={pathname === banner.link ? 'true' : 'false'}>
        <StyledImageContainer>
          <Image src={banner.image} width={isMobile ? 156 : 438} height={isMobile ? 48 : 113} />
        </StyledImageContainer>
      </StyledButton>
    </Link>
  )
}
