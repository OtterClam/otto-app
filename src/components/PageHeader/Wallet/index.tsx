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

const StyledContainer = styled.div<{ connected: boolean }>`
  display: inline-flex;
  align-items: stretch;
  height: 48px;

  &::before,
  &::after {
    display: ${props => (props.connected ? 'block' : 'none')};
    content: '';
    width: 5px;
    background: center / 5px 48px url(${LargeEdge.src});
  }

  &::after {
    transform: rotate(180deg);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1;
    height: 22px;

    &::before,
    &::after {
      background: center / 5px 22px url(${SmallEdge.src});
    }
  }
`

const StyledAddress = styled(Caption)`
  display: flex;
  align-items: center;
  background: left / 1px 48px url(${LargeCenter.src});
  color: ${props => props.theme.colors.white};
  padding: 0 0.5em;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1;
    justify-content: center;
    background: left / 1px 22px url(${SmallCenter.src});
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
    dispatch(connectWallet())
  }

  return (
    <StyledContainer connected={Boolean(account)}>
      {account && <StyledAddress>{account}</StyledAddress>}
      {!account && (
        <Button onClick={onClick} Typography={Caption}>
          {t('header.connect')}
        </Button>
      )}
    </StyledContainer>
  )
}
