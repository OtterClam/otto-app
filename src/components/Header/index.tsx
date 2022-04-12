import { useMediaQuery } from 'hooks/useMediaQuery'
import styled from 'styled-components'
import { breakpoints } from 'styles/breakpoints'
import { Display3 } from 'styles/typography'
import Button from 'components/Button'
import { useDispatch } from 'react-redux'
import { showSideMenu } from 'store/uiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useEthers } from '@usedapp/core'
import Connector from './Connector'
import ClamBalance from './ClamBalance'
import logoLarge from './logo-large.png'
import logoSmall from './logo-small.png'
import iconHamburger from './icon-hamburger.svg'

const StyledHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 95%;
  }
`

const StyledLogoLink = styled(Link)`
  height: 100%;
`

const StyledLogo = styled.img`
  height: 100%;
`

const StyledBackButton = styled.button`
  width: 68px;
  height: 100%;
  background: ${({ theme }) => theme.colors.clamPink};
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledTitle = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  background-color: #fff;
  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.otterBlack};
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledIcon = styled.img``

export default function Header({ title }: { title: string }) {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery(breakpoints.mobile)
  const { account } = useEthers()
  const hideConnector = isMobile && Boolean(account)

  return (
    <StyledHeader>
      <StyledLogoLink to="/">
        <StyledLogo src={isMobile ? logoSmall : logoLarge} alt="logo" />
      </StyledLogoLink>
      {window.location.pathname !== '/' && window.history.length > 2 && (
        <StyledBackButton onClick={() => window.history.back()}>
          <Display3>{'<'}</Display3>
        </StyledBackButton>
      )}
      <StyledTitle>
        <Display3>{title}</Display3>
      </StyledTitle>
      {!isMobile && <ClamBalance />}
      {!hideConnector && <Connector />}
      <Button primaryColor="white" padding="2px 6px" onClick={() => dispatch(showSideMenu())}>
        <StyledIcon src={iconHamburger} />
      </Button>
    </StyledHeader>
  )
}
