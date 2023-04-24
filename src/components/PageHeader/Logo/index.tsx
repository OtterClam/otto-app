import Link from 'next/link'
import styled from 'styled-components/macro'

const LogoLarge = '/images/header/logo-large.png'
const LogoSmall = '/images/header/logo-small.png'

const StyledContainer = styled.div`
  flex: 0 148px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1 40px;
    min-width: 40px;
  }
`

const StyledLogo = styled.a`
  display: block;
  background: center / 148px 40px url(${LogoLarge});
  height: 40px;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: center / 40px 40px url(${LogoSmall});
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
