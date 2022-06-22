import { useEthers } from '@usedapp/core'
import styled from 'styled-components/macro'
import Button from 'components/Button'
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
  display: inline-flex;
  align-items: stretch;
  height: 40px;

  &::before,
  &::after {
    display: block;
    content: '';
    width: 8px;
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
      background: center / 5px 24px url(${props => (props.isButton ? SmallBtnEdge.src : SmallEdge.src)});
    }
  }
`

const StyledText = styled(Caption)<{ isButton?: boolean }>`
  display: flex;
  align-items: center;
  background: left / 1px 40px url(${props => (props.isButton ? LargeBtnCenter.src : LargeCenter.src)});
  color: ${props => props.theme.colors.white};
  padding: 0 0.5em;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1;
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
    <StyledContainer isButton={!account} as={account ? undefined : 'button'} onClick={onClick}>
      <StyledText isButton={!account}>{account ?? t('header.connect')}</StyledText>
    </StyledContainer>
  )
}
