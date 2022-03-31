import { useMediaQuery } from 'hooks/useMediaQuery'
import styled from 'styled-components'
import { breakpoints } from 'styles/breakpoints'
import { Display3 } from 'styles/typography'
import Connector from './Connector'
import ClamBalance from './ClamBalance'
import logoLarge from './logo-large.svg'
import logoSmall from './logo-small.svg'

const StyledHeader = styled.div`
  /* position: relative; */
  width: 90%;
  max-width: 1200px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
`

const StyledLogo = styled.img`
  height: 100%;
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
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 180px;
  }
`

export default function Header({ title }: { title: string }) {
  const isMobile = useMediaQuery(breakpoints.mobile)

  return (
    <StyledHeader>
      <StyledLogo src={isMobile ? logoSmall : logoLarge} alt="logo" />
      <NavItems>
        <NavItem>
          <Display3>{title}</Display3>
        </NavItem>
      </NavItems>
      {!isMobile && <ClamBalance />}
      <Connector />
      {/* <div style={{ flex: 1 }} /> */}
    </StyledHeader>
  )
}
