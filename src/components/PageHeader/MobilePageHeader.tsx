import dynamic from 'next/dynamic'
import styled from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { connectWallet, showFishWalletPopup, showWalletPopup } from 'store/uiSlice'
import { useEthers } from '@usedapp/core'
import Logo from './Logo'
import Wallet from './Wallet'
import Title from './Title'
import { PageHeaderProps } from './type'
import { MaticBalance, FishBalance } from './Balance'
import MenuButton from './MenuButton'
import FishWalletPopup from './FishWalletPopup'

const WalletPopup = dynamic(() => import('./WalletPopup'), { ssr: false })

const StyledContainer = styled.div`
  position: fixed;
  z-index: var(--z-index-header);
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 5px 5% 10px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #5c3317 0%, #45240d 100%);
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export default function PageHeader({ title }: PageHeaderProps) {
  const { account } = useEthers()
  const dispatch = useDispatch()

  return (
    <StyledContainer>
      <StyledRow>
        <Logo />
        <MaticBalance onClick={() => !account && dispatch(connectWallet())} />
        <FishBalance onClick={() => dispatch(account ? showFishWalletPopup() : connectWallet())} />
        <Wallet />
      </StyledRow>
      <StyledRow>
        <Title>{title}</Title>
        <MenuButton />
      </StyledRow>
      <WalletPopup />
      <FishWalletPopup />
    </StyledContainer>
  )
}
