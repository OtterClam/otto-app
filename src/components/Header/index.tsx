import { useEthers } from '@usedapp/core'
import Button from 'components/Button'
import { IS_SERVER } from 'constant'
import { useBreakpoints } from 'contexts/Breakpoints'
import { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { showSideMenu } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { Display3 } from 'styles/typography'
import ClamBalance from './ClamBalance'
import Connector from './Connector'
import iconHamburger from './icon-hamburger.svg'
import logoLarge from './logo-large.png'
import logoSmall from './logo-small.png'

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
    height: 48px;
    margin: 10px 0;
    gap: 5px;
  }
`

const StyledLogoLink = styled.a`
  width: 251px;
  height: 68px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 48px;
    height: 48px;
  }
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
  color: ${props => props.theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 48px;
    height: 48px;
  }
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

const StyledHamburger = styled(Button)`
  width: 68px;
  height: 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 48px;
  }
`

const StyledIcon = styled.img``

export default function Header({ title }: { title: string }) {
  const dispatch = useDispatch()
  const { isMobile } = useBreakpoints()
  const { account } = useEthers()
  const hideConnector = isMobile && Boolean(account)
  const showBackBtn = !IS_SERVER && window.location.pathname !== '/' && window.history.length > 2

  return (
    <StyledHeader>
      <Link href="/">
        <StyledLogoLink>
          <StyledLogo src={isMobile ? logoSmall.src : logoLarge.src} alt="logo" />
        </StyledLogoLink>
      </Link>
      {showBackBtn && (
        <StyledBackButton onClick={() => window.history.back()}>
          <Display3>{'<'}</Display3>
        </StyledBackButton>
      )}
      <StyledTitle>
        <Display3>{title}</Display3>
      </StyledTitle>
      {!isMobile && <ClamBalance />}
      {!hideConnector && <Connector />}
      <StyledHamburger
        primaryColor="white"
        padding="0 4px"
        onClick={() => dispatch(showSideMenu())}
        Typography={Fragment}
      >
        <StyledIcon src={iconHamburger.src} />
      </StyledHamburger>
    </StyledHeader>
  )
}
