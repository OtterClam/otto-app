import styled, { ThemeProvider } from 'styled-components'
import { Outlet } from 'react-router-dom'
import { ChainId, Config, DAppProvider } from '@usedapp/core'

import { theme } from 'styles'
import MintPopup from 'components/MintPopup'
import Footer from './components/Footer'
import Header from './components/Header'
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
`

const StyledBorder = styled.div`
  max-width: 1200px;
  flex: 1;
  width: 90%;
  height: 100%;
  overflow: hidden;
  padding: 6px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  box-sizing: border-box;
  backdrop-filter: blur(5px);
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.crownYellow};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerBorder = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const StyledContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.otterBlack};
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
          <Header />
          <StyledBorder>
            <StyledInnerBorder>
              <StyledContainer>
                <Outlet />
              </StyledContainer>
            </StyledInnerBorder>
          </StyledBorder>
          <Footer />
          <Error />
          <WalletSelector />
          <MintPopup />
        </DAppProvider>
      </StyledApp>
    </ThemeProvider>
  )
}

export default App
