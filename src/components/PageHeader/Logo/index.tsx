import Link from 'next/link'
import styled from 'styled-components/macro'
import LogoLarge from './logo-large.png'
import LogoSmall from './logo-small.png'

const StyledContainer = styled.div`
  flex: 0 148px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1 40px;
    min-width: 40px;
  }
`

const StyledLogo = styled.a`
  background: center / 148px 40px url(${LogoLarge.src});
  height: 40px;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: center / 40px 40px url(${LogoSmall.src});
    width: 40px;
    height: 40px;
  }
`

export default function Logo() {
  return (
    <StyledContainer>
      <Link href="/">
        <StyledLogo />
      </Link>
    </StyledContainer>
  )
}
