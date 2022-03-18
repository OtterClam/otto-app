import { useEffect } from 'react'
import styled from 'styled-components'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useEthers } from '@usedapp/core'
import { useDispatch, useSelector } from 'react-redux'

import { ContentLarge } from 'styles/typography'
import metamask from '../assets/wallets/metamask.jpg'
import walletConnect from '../assets/wallets/walletconnect.jpg'
import Popup from './Popup'
import { selectConnectingWallet, walletConnected } from '../store/uiSlice'

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    137: 'https://polygon-rpc.com',
  },
  qrcode: true,
})

const Option = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0.7rem 0;
  background: white;
  border: 4px solid ${({ theme }) => theme.colors.lightGray300};
  border-radius: 10px;

  padding: 0.9rem 1.2rem;
  @media (max-width: 600px) {
    padding: 0.8rem 1.6rem;
  }
`

const Name = styled(ContentLarge)`
  display: flex;
  align-items: center;
  flex: 1;
`

const Icon = styled.img`
  width: 3.2rem;
`

const WalletSelector = (): JSX.Element => {
  const dispatch = useDispatch()
  const { account, activateBrowserWallet, activate } = useEthers()
  const connectingWallet = useSelector(selectConnectingWallet)
  return (
    <Popup show={connectingWallet && !account} close={() => dispatch(walletConnected())} header="Connect to a wallet">
      <Option onClick={() => activateBrowserWallet()}>
        <Name>Metamask</Name>
        <Icon src={metamask} alt="Metamask logo" />
      </Option>
      <Option onClick={() => activate(walletConnectConnector)}>
        <Name>WalletConnect</Name>
        <Icon src={walletConnect} alt="WalletConnect logo" />
      </Option>
    </Popup>
  )
}

export default WalletSelector
