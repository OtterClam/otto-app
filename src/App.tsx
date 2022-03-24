import styled, { ThemeProvider } from 'styled-components'
import { ChainId, Config, DAppProvider } from '@usedapp/core'

import { theme } from 'styles'
import MintPopup from 'components/MintPopup'
import { Outlet } from 'react-router-dom'
import Error from './components/Error'
import WalletSelector from './components/WalletSelector'
import bg from './assets/bg.jpg'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: auto;
    background-position: center;
  }
`

const config: Config = {
  readOnlyChainId: ChainId.Polygon,
  readOnlyUrls: {
    [ChainId.Polygon]: 'https://polygon-rpc.com',
    [ChainId.Hardhat]: 'http://127.0.0.1:8545',
  },
  multicallAddresses: {
    [ChainId.Hardhat]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  },
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <DAppProvider config={config}>
          <Outlet />
          <Error />
          <WalletSelector />
          <MintPopup />
        </DAppProvider>
      </StyledApp>
    </ThemeProvider>
  )
}

export default App
