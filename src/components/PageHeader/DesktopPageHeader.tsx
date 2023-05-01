import dynamic from 'next/dynamic'
import styled from 'styled-components/macro'
import { useRef } from 'react'
import { useEthers } from '@usedapp/core'
import { connectWallet, showFishWalletPopup, showWalletPopup } from 'store/uiSlice'
import { useDispatch } from 'react-redux'
import Logo from './Logo'
import Wallet from './Wallet'
import Title from './Title'
import { PageHeaderProps } from './type'
import { MaticBalance, FishBalance } from './Balance'
import MenuButton from './MenuButton'

const WalletPopup = dynamic(() => import('./WalletPopup'), { ssr: false })
const FishWalletPopup = dynamic(() => import('./FishWalletPopup'), { ssr: false })

const StyledContainer = styled.div`
  position: fixed;
  z-index: var(--z-index-header);
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background: linear-gradient(180deg, #5c3317 0%, #45240d 100%);
`

const StyledInnerContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: var(--header-height);
  min-height: var(--header-height);
  margin: 0 auto;
`

export default function PageHeader({ title }: PageHeaderProps) {
  const clamRef = useRef<HTMLDivElement>(null)
  const fishRef = useRef<HTMLDivElement>(null)
  const { account } = useEthers()
  const dispatch = useDispatch()

  return (
    <StyledContainer>
      <StyledInnerContainer>
        <Logo />
        <Title>{title}</Title>
        <div ref={clamRef}>
          <MaticBalance onClick={() => !account && dispatch(connectWallet())} />
        </div>
        <div ref={fishRef}>
          <FishBalance onClick={() => dispatch(account ? showFishWalletPopup() : connectWallet())} />
        </div>
        <Wallet />
        <MenuButton />
      </StyledInnerContainer>
      <WalletPopup alignRef={clamRef} />
      <FishWalletPopup alignRef={fishRef} />
    </StyledContainer>
  )
}
