import { useEthers } from '@usedapp/core'
import styled from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { connectWallet } from 'store/uiSlice'
import { Caption } from 'styles/typography'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useTranslation } from 'next-i18next'

const LargeEdge = '/images/header/large-edge.png'
const LargeCenter = '/images/header/large-center-wallet.png'
const SmallEdge = '/images/header/small-edge.png'
const SmallCenter = '/images/header/small-center-wallet.png'
const LargeBtnEdge = '/images/header/large-btn-edge.png'
const LargeBtnCenter = '/images/header/large-btn-center.png'
const SmallBtnEdge = '/images/header/small-btn-edge.png'
const SmallBtnCenter = '/images/header/small-btn-center.png'

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
    background: center / 8px 40px url(${props => (props.isButton ? LargeBtnEdge : LargeEdge)});
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
      background: center / 5px 24px url(${props => (props.isButton ? SmallBtnEdge : SmallEdge)});
    }
  }
`

const StyledText = styled(Caption)<{ isButton?: boolean }>`
  flex: ${props => (props.isButton ? '0' : '1')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: left / 1px 40px url(${props => (props.isButton ? LargeBtnCenter : LargeCenter)});
  color: ${props => props.theme.colors.white};
  white-space: nowrap;
  padding: 0 0.5em;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 0;
    justify-content: center;
    background: left / 1px 24px url(${props => (props.isButton ? SmallBtnCenter : SmallCenter)});
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
