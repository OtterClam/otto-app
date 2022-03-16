import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Connector from '../Connector'
import logo from './Logo.svg'

const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  border: solid 1px blue;
`

const StyledLogo = styled.img``

const NavItems = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate(-50%, -50%);
`

const NavItem = styled.div`
  margin: 0 1rem;
  font-size: 2rem;
`

const Header = () => {
  return (
    <StyledHeader>
      <StyledLogo src={logo} alt="logo" />
      <NavItems>
        <NavItem>Page Title</NavItem>
      </NavItems>
      <Connector />
    </StyledHeader>
  )
}

export default Header
