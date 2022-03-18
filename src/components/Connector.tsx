import { shortenAddress, useEthers } from '@usedapp/core'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ContentLarge } from 'styles/typography'
import { connectWallet } from '../store/uiSlice'

const StyledConnectButton = styled.button`
  border: 4px solid #1d2654;
  border-radius: 10px;
  height: 100%;
  padding: 16px;
  background-color: white;
`

const Connector = () => {
  const dispatch = useDispatch()
  const { account } = useEthers()

  return (
    <StyledConnectButton onClick={() => dispatch(connectWallet())}>
      <ContentLarge>{account ? shortenAddress(account) : 'Connect Wallet'}</ContentLarge>
    </StyledConnectButton>
  )
}

export default Connector
