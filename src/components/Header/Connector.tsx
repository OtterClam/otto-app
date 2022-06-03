import { shortenAddress, useEthers } from '@usedapp/core'
import Button from 'components/Button'
import { useMediaQuery } from 'hooks/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'
import { breakpoints } from 'styles/breakpoints'
import { ContentLarge } from 'styles/typography'
import { connectWallet } from '../../store/uiSlice'

const StyledAccount = styled.p`
  display: flex;
  align-items: center;
  padding: 0 6px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 10px;
`

const Connector = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { account } = useEthers()
  const isMobile = useMediaQuery(breakpoints.mobile)
  return account ? (
    <StyledAccount>
      <ContentLarge>{shortenAddress(account)}</ContentLarge>
    </StyledAccount>
  ) : (
    <Button
      height="100%"
      padding={isMobile ? '0 2px' : '0 45px'}
      Typography={ContentLarge}
      onClick={() => dispatch(connectWallet())}
    >
      {t('header.connect')}
    </Button>
  )
}

export default Connector
