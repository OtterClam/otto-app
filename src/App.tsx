import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import ottoLoadingImage from 'assets/ui/otto-loading.jpg'
import adventureMapImage from 'components/AdventureMap/map.jpg'
import SkeletonThemeProvider from 'components/SkeletonThemeProvider'
import { ApiProvider } from 'contexts/Api'
import { AssetsLoaderProvider } from 'contexts/AssetsLoader'
import { BannersProvider } from 'contexts/Banners'
import { BreakpointsProvider } from 'contexts/Breakpoints'
import { CurrencyProvider } from 'contexts/Currency'
import { MyItemsProvider } from 'contexts/MyItems'
import { OverlayProvider } from 'contexts/Overlay'
import { RepositoriesProvider } from 'contexts/Repositories'
import { WalletProvider } from 'contexts/Wallet'
import useApollo from 'hooks/useApollo'
import useContractAddresses from 'hooks/useContractAddresses'
import usePreloadImages from 'hooks/usePreloadImage'
import useServiceWorker from 'hooks/useServiceWorker'
import MyOttosProvider from 'MyOttosProvider'
import dynamic from 'next/dynamic'
import OtterSubgraphProvider from 'OtterSubgraphProvider'
import { PropsWithChildren, useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components/macro'
import { theme } from 'styles'
import MissionPopup from 'views/mission/MissionPopup'
import MyMissionsProvider from 'views/mission/MyMissionsProvider'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'

const preloadImages = [ottoLoadingImage.src, adventureMapImage.src]

const AssetsLoader = dynamic(() => import('components/AssetsLoader'), { ssr: false })

const SideMenu = dynamic(() => import('components/SideMenu'), { ssr: false })

const ItemDetailsPopup = dynamic(() => import('components/ItemDetailsPopup'), { ssr: false })

const OttoPopup = dynamic(() => import('components/OttoPopup'), { ssr: false })

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
  usePreloadImages(preloadImages)
  useServiceWorker()
  useContractAddresses()
  const apollo = useApollo()

  useRealWindowSize()

  return (
    <ApolloProvider client={apollo}>
      <OtterSubgraphProvider>
        <WalletProvider>
          <ApiProvider>
            <RepositoriesProvider>
              <AssetsLoaderProvider>
                <CurrencyProvider>
                  <ThemeProvider theme={theme}>
                    <BreakpointsProvider>
                      <MyOttosProvider>
                        <MyItemsProvider>
                          <BannersProvider>
                            <OverlayProvider>
                              <StyledApp>
                                <SkeletonThemeProvider>
                                  <StyledPageContainer>{children}</StyledPageContainer>
                                  <Error />
                                  <WalletSelector />
                                  <SideMenu />
                                  <MyMissionsProvider>
                                    <MissionPopup />
                                  </MyMissionsProvider>
                                  <AssetsLoader />
                                  <ItemDetailsPopup />
                                  <OttoPopup />
                                </SkeletonThemeProvider>
                              </StyledApp>
                            </OverlayProvider>
                          </BannersProvider>
                        </MyItemsProvider>
                      </MyOttosProvider>
                    </BreakpointsProvider>
                  </ThemeProvider>
                </CurrencyProvider>
              </AssetsLoaderProvider>
            </RepositoriesProvider>
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
