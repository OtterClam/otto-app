import { useEthers } from '@usedapp/core'
import styled from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { connectWallet } from 'store/uiSlice'
import { Caption } from 'styles/typography'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useTranslation } from 'next-i18next'
import LargeEdge from './large-edge.png'
import LargeCenter from './large-center.png'
import SmallEdge from './small-edge.png'
import SmallCenter from './small-center.png'
import LargeBtnEdge from './large-btn-edge.png'
import LargeBtnCenter from './large-btn-center.png'
import SmallBtnEdge from './small-btn-edge.png'
import SmallBtnCenter from './small-btn-center.png'

const StyledContainer = styled.div<{ isButton?: boolean }>`
  flex: ${props => (props.isButton ? '0' : '1')};
  max-width: ${props => (props.isButton ? 'unset' : '80px')};
`

const StyledContent = styled.div<{ isButton?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: end;
  height: 40px;
  width: 100%;

  &::before,
  &::after {
    display: block;
    content: '';
    width: 8px;
    min-width: 8px;
    background: center / 8px 40px url(${props => (props.isButton ? LargeBtnEdge.src : LargeEdge.src)});
  }

  &::after {
    transform: rotate(180deg);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1;
    height: 24px;

    &::before,
    &::after {
      width: 5px;
      min-width: 5px;
      background: center / 5px 24px url(${props => (props.isButton ? SmallBtnEdge.src : SmallEdge.src)});
    }
  }
`

const StyledText = styled(Caption)<{ isButton?: boolean }>`
  flex: ${props => (props.isButton ? '0' : '1')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: left / 1px 40px url(${props => (props.isButton ? LargeBtnCenter.src : LargeCenter.src)});
  color: ${props => props.theme.colors.white};
  white-space: nowrap;
  padding: 0 0.5em;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 0;
    justify-content: center;
    background: left / 1px 24px url(${props => (props.isButton ? SmallBtnCenter.src : SmallCenter.src)});
  }
`

const useAccount = () => {
  const { account } = useEthers()
  const { isMobile } = useBreakpoints()
  const size = isMobile ? 2 : 3

  if (account) {
    return `${account.substring(0, size)}...${account.substring(account.length - size, account.length)}`
  }
}

export default function Wallet() {
  const account = useAccount()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onClick = () => {
    if (!account) {
      dispatch(connectWallet())
    }
  }

  return (
    <StyledContainer isButton={!account}>
      <StyledContent isButton={!account} as={account ? undefined : 'button'} onClick={onClick}>
        <StyledText isButton={!account}>{account ?? t('header.connect')}</StyledText>
      </StyledContent>
    </StyledContainer>
  )
}
