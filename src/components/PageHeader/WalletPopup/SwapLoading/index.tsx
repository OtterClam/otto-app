import LoadingIndicator from 'assets/ui/loading-indicator.svg'
import Button from 'components/Button'
import { formatUnits } from 'ethers/lib/utils'
import { trim } from 'helpers/trim'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { ContentLarge, ContentSmall, Headline } from 'styles/typography'
import { SwapTransactionState, TokenInfo } from '../1inchHelper'
import ArrowRight from './arrow-right.svg'

interface Props {
  swapState: SwapTransactionState
  fromTokenInfo: TokenInfo
  toTokenInfo: TokenInfo
  onClose: () => void
  onSuccess: () => void
}

const StyledLoadingContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  padding: 20px 12px 12px 12px;
  gap: 20px;
`

const StyledLoadingTitle = styled(ContentLarge).attrs({ as: 'h2' })``

const StyledLoadingDesc = styled(ContentSmall).attrs({ as: 'p' })``

const StyledSuccessBody = styled.div`
  display: flex;
  padding: 10px 0;
  gap: 15px;
`

export default function SwapLoading({ swapState, fromTokenInfo, toTokenInfo, onClose, onSuccess }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup.swap' })
  let title = ''
  let desc = ''
  let showCloseButton = false
  let body: React.ReactNode = <Image src={LoadingIndicator} width="80px" height="80px" />
  switch (swapState.state) {
    case 'Approving':
      title = t('approving_title')
      desc = t('approving_desc', { symbol: fromTokenInfo.symbol })
      // showCloseButton = true
      break
    case 'Success':
      title = t('tx_success_title')
      desc = t('tx_success_desc', {
        to: toTokenInfo.symbol,
        amount: trim(formatUnits(swapState.amountOut || '0', toTokenInfo.decimal), 4),
      })
      showCloseButton = true
      body = (
        <StyledSuccessBody>
          <Image width="60px" height="60px" src={fromTokenInfo.icon} />
          <Image src={ArrowRight} />
          <Image width="60px" height="60px" src={toTokenInfo.icon} />
        </StyledSuccessBody>
      )
      break
    case 'Mining':
      title = t('tx_sent_title')
      desc = t('tx_sent_desc', { from: fromTokenInfo.symbol, to: toTokenInfo.symbol })
      break
    case 'PendingSignature':
    default:
      title = t('sign_tx_title')
      desc = t('sign_tx_desc')
      break
  }
  return (
    <StyledLoadingContainer>
      <StyledLoadingTitle>{title}</StyledLoadingTitle>
      {body}
      <StyledLoadingDesc>{desc}</StyledLoadingDesc>
      {showCloseButton && (
        <Button primaryColor="white" width="100%" Typography={Headline} onClick={onClose}>
          {t('close_btn')}
        </Button>
      )}
    </StyledLoadingContainer>
  )
}
