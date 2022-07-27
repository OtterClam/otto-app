import styled from 'styled-components/macro'
import useIsAtTop from 'hooks/useIsAtTop'
import Logo from './Logo'
import Wallet from './Wallet'
import Title from './Title'
import { PageHeaderProps } from './type'
import { ClamBalance, FishBalance } from './Balance'
import MenuButton from './MenuButton'
import WalletPopup from './WalletPopup'

const StyledContainer = styled.div<{ isAtTop: boolean }>`
  position: fixed;
  z-index: var(--z-index-header);
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);

  &::after {
    content: '';
    background: linear-gradient(180deg, #5c3317 0%, #45240d 100%);
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  ${({ isAtTop }) =>
    !isAtTop &&
    `
    &::after {
      opacity: 1;
    }
  `}
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

const StyledClamBalanceContainer = styled.div``

const StyledWalletPopup = styled(WalletPopup)`
  position: absolute;
  /* display: none; */
  display: block;
  ${StyledClamBalanceContainer}:hover & {
    display: block;
  }
`

export default function PageHeader({ title }: PageHeaderProps) {
  const isAtTop = useIsAtTop()

  return (
    <StyledContainer isAtTop={isAtTop}>
      <StyledInnerContainer>
        <Logo />
        <Title>{title}</Title>
        <StyledClamBalanceContainer>
          <ClamBalance />
          <StyledWalletPopup />
        </StyledClamBalanceContainer>
        <FishBalance />
        <Wallet />
        <MenuButton />
      </StyledInnerContainer>
    </StyledContainer>
  )
}
