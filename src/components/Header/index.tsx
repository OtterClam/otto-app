import { useMediaQuery } from 'hooks/useMediaQuery'
import styled from 'styled-components'
import { breakpoints } from 'styles/breakpoints'
import { Display3 } from 'styles/typography'
import Connector from '../Connector'
import logoLarge from './logo-large.svg'
import logoSmall from './logo-small.svg'

const StyledHeader = styled.div`
  position: relative;
  width: 90%;
  height: 68px;
  display: flex;
  align-items: center;
  margin: 20px 0;
`

const StyledLogo = styled.img`
  height: 100%;
  flex: 1;
`

const NavItems = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: center;
`

const NavItem = styled.div`
  display: flex;
  width: 420px;
  height: 100%;
  background-color: #fff;
  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 180px;
  }
`

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.mobile)

  return (
    <StyledHeader>
      <StyledLogo src={isMobile ? logoSmall : logoLarge} alt="logo" />
      <NavItems>
        <NavItem>
          <Display3>Mint Portals</Display3>
        </NavItem>
      </NavItems>
      {/* <Connector /> */}
      <div style={{ flex: 1 }} />
    </StyledHeader>
  )
}

export default Header
