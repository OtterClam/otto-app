import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider, useEthers } from '@usedapp/core'
import MintPopup from 'components/MintPopup'
import SideMenu from 'components/SideMenu'
import useApollo from 'hooks/useApollo'
import MyOttosProvider from 'MyOttosProvider'
import { Outlet } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components/macro'
import { theme } from 'styles'
import bg from './assets/bg.jpg'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  color: ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    min-height: 100vh;
    background-position: center;
    background-size: cover;
  }
`

const config: Config = {
  readOnlyChainId: ChainId.Polygon,
  readOnlyUrls: {
    [ChainId.Polygon]: 'https://polygon-rpc.com',
  },
  multicallAddresses: {
    [ChainId.Hardhat]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  },
}

const ApolloApp = () => {
  const apollo = useApollo()
  return (
    <ApolloProvider client={apollo}>
      <ThemeProvider theme={theme}>
        <MyOttosProvider>
          <StyledApp>
            <Outlet />
            <Error />
            <WalletSelector />
            <MintPopup />
            <SideMenu />
          </StyledApp>
        </MyOttosProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

const App = () => {
  return (
    <DAppProvider config={config}>
      <ApolloApp />
    </DAppProvider>
  )
}

export default App
