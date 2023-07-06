import { useEthers } from '@usedapp/core'
import { useTranslation } from 'next-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import CoinbaseWalletIcon from 'assets/wallets/coinbase.png'
import metamask from 'assets/wallets/metamask.jpg'
import walletConnect from 'assets/wallets/walletconnect.jpg'
import { selectConnectingWallet, walletConnected } from '../../store/uiSlice'
import Popup from '../Popup'
import Banner from './wallet.png'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledBanner = styled.img`
  width: 180px;
`

const Option = styled.button`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  background: white;
  border: 4px solid ${({ theme }) => theme.colors.lightGray300};
  border-radius: 10px;

  padding: 0 20px;
`

const Name = styled(ContentLarge)`
  display: flex;
  align-items: center;
  flex: 1;
`

const Icon = styled.img`
  width: 36px;
`

const WalletSelector = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { account, activateBrowserWallet } = useEthers()
  const connectingWallet = useSelector(selectConnectingWallet)
  return (
    <Popup
      show={connectingWallet && !account}
      close={() => dispatch(walletConnected())}
      header={t('wallet_selector_head')}
    >
      <StyledContainer>
        <StyledBanner src={Banner.src} />
        <Option onClick={() => activateBrowserWallet({ type: 'metamask' })}>
          <Name>Metamask</Name>
          <Icon src={metamask.src} alt="Metamask logo" />
        </Option>
        <Option onClick={() => activateBrowserWallet({ type: 'walletconnect' })}>
          <Name>WalletConnect</Name>
          <Icon src={walletConnect.src} alt="WalletConnect logo" />
        </Option>
        <Option onClick={() => activateBrowserWallet({ type: 'coinbase' })}>
          <Name>Coinbase Wallet</Name>
          <Icon src={CoinbaseWalletIcon.src} alt="Coinbase Wallet" />
        </Option>
      </StyledContainer>
    </Popup>
  )
}

export default WalletSelector
