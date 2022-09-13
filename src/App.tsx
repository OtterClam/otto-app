import dynamic from 'next/dynamic'
import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import { BreakpointsProvider } from 'contexts/Breakpoints'
import useApollo from 'hooks/useApollo'
import useContractAddresses from 'hooks/useContractAddresses'
import MyOttosProvider from 'MyOttosProvider'
import OtterSubgraphProvider from 'OtterSubgraphProvider'
import SnapshotProvider from 'SnapshotSubgraphProvider'
import { PropsWithChildren, useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components/macro'
import { theme } from 'styles'
import { CurrencyProvider } from 'contexts/Currency'
import useServiceWorker from 'hooks/useServiceWorker'
import { AssetsLoaderProvider } from 'contexts/AssetsLoader'
import MintPopup from 'components/MintPopup'
import { WalletProvider } from 'contexts/Wallet'
import { ApiProvider } from 'contexts/Api'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'

const AssetsLoader = dynamic(() => import('components/AssetsLoader'), { ssr: false })

const SideMenu = dynamic(() => import('components/SideMenu'), { ssr: false })

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`

const StyledPageContainer = styled.div.attrs({ id: 'page' })`
  width: 100%;
`

const config: Config = {
  readOnlyChainId: ChainId.Polygon,
  readOnlyUrls: {
    [ChainId.Polygon]: 'https://polygon-rpc.com',
    // [ChainId.Mumbai]: process.env.NEXT_PUBLIC_RPC_ENDPOINT_MUMBAI || '',
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
  useServiceWorker()
  useContractAddresses()
  const apollo = useApollo()

  useRealWindowSize()

  return (
    <ApolloProvider client={apollo}>
      <OtterSubgraphProvider>
        <WalletProvider>
          <ApiProvider>
            <AssetsLoaderProvider>
              <CurrencyProvider>
                <ThemeProvider theme={theme}>
                  <BreakpointsProvider>
                    <MyOttosProvider>
                      <SnapshotProvider>
                        <StyledApp>
                          <StyledPageContainer>{children}</StyledPageContainer>
                          <Error />
                          <WalletSelector />
                          <SideMenu />
                          <AssetsLoader />
                        </StyledApp>
                      </SnapshotProvider>
                    </MyOttosProvider>
                  </BreakpointsProvider>
                </ThemeProvider>
              </CurrencyProvider>
            </AssetsLoaderProvider>
          </ApiProvider>
        </WalletProvider>
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
