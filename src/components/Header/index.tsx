import { useMediaQuery } from 'hooks/useMediaQuery'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { breakpoints } from 'styles/breakpoints'
import { Display3 } from 'styles/typography'
import Connector from '../Connector'
import logoLarge from './logo-large.svg'
import logoSmall from './logo-small.svg'

const StyledHeader = styled.div`
  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
  padding: 20px 0;
`

const StyledLogo = styled.img`
  height: 60px;
`

const NavItems = styled.div`
  display: flex;
  height: 68px;
  justify-content: left;
`

const NavItem = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate(-50%, -50%);
  width: 420px;
  background-color: #fff;
  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 180px;
    height: 60px;
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
    </StyledHeader>
  )
}

export default Header
