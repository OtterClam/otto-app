import Button from 'components/Button'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import { shortenAddress, useEthers } from '@usedapp/core'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Wallet from 'assets/ui/wallet.svg'
import { connectWallet } from 'store/uiSlice'
import { CheckedIcon } from 'assets/icons'

const StyledStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlue};
  border-radius: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
`

const StyledIcon = styled.img.attrs({ src: Wallet.src })`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })`
  flex: 1;
  white-space: pre;
`

const StyledHighlight = styled.span`
  color: ${({ theme }) => theme.colors.otterBlue};
`

interface Props {
  onComplete: () => void
  className?: string
}

export default function ConnectStep({ onComplete, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps.wallet' })
  const dispatch = useDispatch()
  const { account } = useEthers()
  useEffect(() => {
    if (account) {
      onComplete()
    }
  }, [account])
  return (
    <StyledStep className={className}>
      <StyledIcon />
      {account ? (
        <StyledDesc>
          {t('desc_completed')}
          <StyledHighlight>{shortenAddress(account)}</StyledHighlight>{' '}
        </StyledDesc>
      ) : (
        <StyledDesc>{t('desc')}</StyledDesc>
      )}
      {account ? (
        <CheckedIcon />
      ) : (
        <Button height="60px" padding="0 10px" Typography={Headline} onClick={() => dispatch(connectWallet())}>
          {t('action')}
        </Button>
      )}
    </StyledStep>
  )
}
