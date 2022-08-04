import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import SideMenu from 'components/SideMenu'
import { BreakpointsProvider } from 'contexts/Breakpoints'
import useApollo from 'hooks/useApollo'
import useContractAddresses from 'hooks/useContractAddresses'
import MyOttosProvider from 'MyOttosProvider'
import OtterSubgraphProvider from 'OtterSubgraphProvider'
import { PropsWithChildren, useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components/macro'
import { theme } from 'styles'
import { CurrencyProvider } from 'contexts/Currency'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`

const config: Config = {
  readOnlyChainId: ChainId.Polygon,
  readOnlyUrls: {
    // [ChainId.Polygon]: 'https://polygon-rpc.com',
    [ChainId.Mumbai]: process.env.NEXT_PUBLIC_RPC_ENDPOINT_MUMBAI || '',
    // [ChainId.Hardhat]: 'http://127.0.0.1:8545',
  },
  multicallAddresses: {
    [ChainId.Hardhat]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  },
  bufferGasLimitPercentage: 15,
}

function useRealWindowSize() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateCssVariables = () => {
        document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`)
      }
      window.addEventListener('resize', updateCssVariables)
      updateCssVariables()
      return () => window.removeEventListener('resize', updateCssVariables)
    }
  }, [])
}

const ApolloApp = ({ children }: PropsWithChildren<object>) => {
  useContractAddresses()
  const apollo = useApollo()

  useRealWindowSize()

  return (
    <ApolloProvider client={apollo}>
      <OtterSubgraphProvider>
        <CurrencyProvider>
          <ThemeProvider theme={theme}>
            <BreakpointsProvider>
              <MyOttosProvider>
                <StyledApp>
                  {children}
                  <Error />
                  <WalletSelector />
                  <SideMenu />
                </StyledApp>
              </MyOttosProvider>
            </BreakpointsProvider>
          </ThemeProvider>
        </CurrencyProvider>
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
