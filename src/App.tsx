import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import dynamic from 'next/dynamic'
import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import { BreakpointsProvider } from 'contexts/Breakpoints'
import useApollo from 'hooks/useApollo'
import useContractAddresses from 'hooks/useContractAddresses'
import MyOttosProvider from 'MyOttosProvider'
import OtterSubgraphProvider from 'OtterSubgraphProvider'
import { PropsWithChildren, useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components/macro'
import { theme } from 'styles'
import { CurrencyProvider } from 'contexts/Currency'
import useServiceWorker from 'hooks/useServiceWorker'
import { AssetsLoaderProvider } from 'contexts/AssetsLoader'
import { WalletProvider } from 'contexts/Wallet'
import { ApiProvider } from 'contexts/Api'
import { OverlayProvider } from 'contexts/Overlay'
import { RepositoriesProvider } from 'contexts/Repositories'
import { MyItemsProvider } from 'contexts/MyItems'
import { combine } from 'utils/provider'
import { BannersProvider } from 'contexts/Banners'
import SkeletonThemeProvider from 'components/SkeletonThemeProvider'
import ottoLoadingImage from 'assets/ui/otto-loading.jpg'
import usePreloadImages from 'hooks/usePreloadImage'
import adventureMapImage from 'components/AdventureMap/map.jpg'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'

const preloadImages = [ottoLoadingImage.src, adventureMapImage.src]

const AssetsLoader = dynamic(() => import('components/AssetsLoader'), { ssr: false })

const SideMenu = dynamic(() => import('components/SideMenu'), { ssr: false })

const ItemDetailsPopup = dynamic(() => import('components/ItemDetailsPopup'), { ssr: false })

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

  const CombinedProvider = combine(
    [ApolloProvider, { client: apollo }],
    [OtterSubgraphProvider, {}],
    [WalletProvider, {}],
    [ApiProvider, {}],
    [RepositoriesProvider, {}],
    [AssetsLoaderProvider, {}],
    [CurrencyProvider, {}],
    [ThemeProvider, { theme }],
    [BreakpointsProvider, {}],
    [MyOttosProvider, {}],
    [MyItemsProvider, {}],
    [OverlayProvider, {}],
    [BannersProvider, {}],
    [SkeletonThemeProvider, {}]
  )

  return (
    <CombinedProvider>
      <StyledApp>
        <StyledPageContainer>{children}</StyledPageContainer>
        <Error />
        <WalletSelector />
        <SideMenu />
        <AssetsLoader />
        <ItemDetailsPopup />
      </StyledApp>
    </CombinedProvider>
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
