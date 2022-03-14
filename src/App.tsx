import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { ChainId, Config, DAppProvider } from "@usedapp/core";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Error from "./components/Error";
import { INFURA_ID } from "./app/globals";
import WalletSelector from "./components/WalletSelector";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const config: Config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  },
};

const App = () => {
  return (
    <StyledApp>
      <DAppProvider config={config}>
        <Header />
        <Outlet />
        <Footer />
        <Error />
        <WalletSelector />
      </DAppProvider>
    </StyledApp>
  );
};

export default App;
