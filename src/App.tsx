import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import MintPopup from 'components/MintPopup'
import SideMenu from 'components/SideMenu'
import { BreakpointsProvider } from 'contexts/Breakpoints'
import useApollo from 'hooks/useApollo'
import useContractAddresses from 'hooks/useContractAddresses'
import MyOttosProvider from 'MyOttosProvider'
import OtterSubgraphProvider from 'OtterSubgraphProvider'
import { PropsWithChildren } from 'react'
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
  background-image: url(${bg.src});
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
    // [ChainId.Mumbai]: process.env.NEXT_PUBLIC_RPC_ENDPOINT_MUMBAI || '',
  },
  multicallAddresses: {
    [ChainId.Hardhat]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  },
  bufferGasLimitPercentage: 15,
}

const ApolloApp = ({ children }: PropsWithChildren<object>) => {
  useContractAddresses()
  const apollo = useApollo()
  return (
    <ApolloProvider client={apollo}>
      <OtterSubgraphProvider>
        <ThemeProvider theme={theme}>
          <BreakpointsProvider>
            <MyOttosProvider>
              <StyledApp>
                {children}
                <Error />
                <WalletSelector />
                <MintPopup />
                <SideMenu />
              </StyledApp>
            </MyOttosProvider>
          </BreakpointsProvider>
        </ThemeProvider>
      </OtterSubgraphProvider>
    </ApolloProvider>
  )
}

const App = ({ children }: PropsWithChildren<object>) => {
  return (
    <DAppProvider config={config}>
      <ApolloApp>{children}</ApolloApp>
    </DAppProvider>
  )
}

export default App
