import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Display3 } from 'styles/typography'
import Connector from '../Connector'
import logo from './Logo.svg'

const StyledHeader = styled.div`
  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
  padding: 20px 0;
`

const StyledLogo = styled.img``

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
`

const Header = () => {
  return (
    <StyledHeader>
      <StyledLogo src={logo} alt="logo" />
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
