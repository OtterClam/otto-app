import LoadingIndicator from 'assets/ui/loading-indicator.svg'
import Button from 'components/Button'
import { trim } from 'helpers/trim'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentSmall, Headline } from 'styles/typography'
import { TokenInfo, SwapTransactionState } from '../token-info'
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

const Spin = keyframes`
  0%, 10% {
    transform: perspective(400px);
  }
  90%, 100% {
    transform: perspective(400px) rotateY(-180deg);
  }
`

const StyledCoin = styled.div`
  width: 60px;
  height: 60px;
  animation: ${Spin} 3s cubic-bezier(0.3, 2, 0.4, 0.8) infinite both;
  transform-style: preserve-3d;
  position: relative;
`

const StyledCoinFace = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.lightGray400};
  border-radius: 50%;

  &:nth-child(1) {
    transform: translateZ(-0.2em) rotateY(180deg);
  }
  &:nth-child(2) {
    transform: translateZ(-0.1em);
  }
  &:nth-child(4) {
    transform: translateZ(0.1em);
  }
  &:nth-child(5) {
    transform: translateZ(0.2em);
  }
`

function SpinCoin({ src }: { src: string }) {
  return (
    <StyledCoin>
      <StyledCoinFace>
        <Image src={src} width={60} height={60} unoptimized />
      </StyledCoinFace>
      <StyledCoinFace />
      <StyledCoinFace />
      <StyledCoinFace />
      <StyledCoinFace>
        <Image src={src} width={60} height={60} unoptimized />
      </StyledCoinFace>
    </StyledCoin>
  )
}

export default function SwapLoading({ swapState, fromTokenInfo, toTokenInfo, onClose, onSuccess }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup.swap' })
  let title = ''
  let desc = ''
  let showCloseButton = false
  let showSuccessButton = false
  let body: React.ReactNode = <Image src={LoadingIndicator} unoptimized width="80px" height="80px" />
  switch (swapState.state) {
    case 'Success':
      title = t('tx_success_title')
      console.log(swapState)
      desc = t('tx_success_desc', {
        to: toTokenInfo.symbol,
        amount: trim(swapState.amountOut || '0', 4),
      })
      body = (
        <StyledSuccessBody>
          <SpinCoin src={fromTokenInfo.icon.src} />
          <Image src={ArrowRight} />
          <SpinCoin src={toTokenInfo.icon.src} />
        </StyledSuccessBody>
      )
      showSuccessButton = true
      break
    case 'Mining':
      title = t('tx_sent_title')
      desc = t('tx_sent_desc', { from: fromTokenInfo.symbol, to: toTokenInfo.symbol })
      showCloseButton = true
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
      {showSuccessButton && (
        <Button primaryColor="white" width="100%" Typography={Headline} onClick={onSuccess}>
          {t('success_btn')}
        </Button>
      )}
    </StyledLoadingContainer>
  )
}
