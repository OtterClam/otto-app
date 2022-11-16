import Button from 'components/Button'
import PaymentButton from 'components/PaymentButton'
import { Token } from 'constant'
import { useWallet } from 'contexts/Wallet'
import { useBuyFish } from 'contracts/functions'
import { useBuyFishReturn } from 'contracts/views'
import { ethers, utils } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { trim } from 'helpers/trim'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Headline, Note, RegularInput } from 'styles/typography'
import { formatClamEthers } from 'utils/currency'
import BuyFISHIcon from './buy-fish.png'
import SwapLoading from './SwapLoading'
import { useTokenInfo } from './token-info'

const StyledSwap = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  padding: 15px 12px;
  gap: 10px;
`

const StyledTitle = styled(ContentLarge).attrs({ as: 'h2' })`
  display: flex;
  justify-content: center;
  &:before {
    width: 43px;
    content: ' ';
    background: center / 43px 38px url(${BuyFISHIcon.src}) no-repeat;
  }
  &:after {
    width: 43px;
    content: ' ';
    background: center / 43px 38px url(${BuyFISHIcon.src}) no-repeat;
  }
`

const StyledAvailable = styled(Note).attrs({ as: 'div' })`
  display: flex;
  gap: 5px;
`

const StyledAvailableAmount = styled.p``

const StyledAvailableToken = styled(Image)``

const StyledTokenInputContainer = styled.div`
  position: relative;

  > * {
    &:last-child {
      margin-top: 10px;
    }
  }
`

const StyledTokenInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 8px;
  padding: 10px;
  padding-right: 15px;
`

const StyledTokenInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledTokenHeader = styled(Caption).attrs({ as: 'p' })``

const StyledMaxButton = styled.button`
  background: ${({ theme }) => theme.colors.lightGray300};
  border-radius: 4px;
  padding: 0 5px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray400};
  }
`

const StyledTokenSymbol = styled.div<{ icon: string }>`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 14px;
  padding: 2px 5px;

  &:before {
    content: '';
    display: block;
    background: no-repeat url(${({ icon }) => icon});
    background-size: 100% 100%;
    width: 22px;
    height: 22px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.otterBlack};
  }
`

const StyledInput = styled(RegularInput)`
  min-width: 0px;
  width: 100%;
  text-align: right;
  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.otterBlack};
  }
`

const StyledSwapInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledSwapInfo = styled(Note).attrs({ as: 'div' })`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.darkGray200};
`

interface Props {
  onClose: () => void
}

export default function Swap({ onClose }: Props) {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup.swap' })
  const [clamAmount, setClamAmount] = useState('1')
  const { buyFishState, buyFish, resetBuyFish } = useBuyFish()
  const { CLAM, FISH } = useContractAddresses()
  const tokenInfo = useTokenInfo()
  const wallet = useWallet()
  const fishReturn = useBuyFishReturn(clamAmount ? ethers.utils.parseUnits(clamAmount, 9) : 0)
  const fishAmount = useMemo(() => ethers.utils.formatUnits(fishReturn, tokenInfo.FISH.decimal), [fishReturn])
  const enoughBalance =
    tokenInfo.CLAM.balance &&
    tokenInfo.CLAM.balance.gte(clamAmount ? parseUnits(clamAmount, tokenInfo.CLAM.decimal) : 0)
  const swapState = useMemo(
    () => ({
      ...buyFishState,
      amountOut: fishAmount,
    }),
    [buyFishState, fishAmount]
  )
  const setMax = () => {
    setClamAmount(trim(formatUnits(tokenInfo.CLAM.balance, tokenInfo.CLAM.decimal), 4))
  }
  useEffect(() => {
    if (swapState.state === 'Success') {
      wallet?.setBalance(CLAM, balance => balance.sub(utils.parseUnits(clamAmount, 9)))
      wallet?.setBalance(FISH, balance => balance.add(utils.parseEther(fishAmount)))
    }
    if (swapState.state === 'Fail' || swapState.state === 'Exception') {
      window.alert(swapState.status.errorMessage)
      resetBuyFish()
    }
  }, [swapState.state])

  if (buyFishState.state !== 'None') {
    return (
      <SwapLoading
        swapState={swapState}
        fromTokenInfo={tokenInfo.CLAM}
        toTokenInfo={tokenInfo.FISH}
        onClose={onClose}
        onSuccess={resetBuyFish}
      />
    )
  }

  return (
    <StyledSwap>
      <StyledTitle>{t('title')}</StyledTitle>
      <StyledAvailable>
        {t('available')}
        <StyledAvailableToken src={tokenInfo.CLAM.icon} width="18px" height="18px" />
        <StyledAvailableAmount>{`${tokenInfo.CLAM.balance ? formatClamEthers(tokenInfo.CLAM.balance) : '-'} ${
          tokenInfo.CLAM.symbol
        }`}</StyledAvailableAmount>
      </StyledAvailable>
      <StyledTokenInputContainer>
        <StyledTokenInput>
          <StyledTokenInputRow>
            <StyledTokenHeader>{t('from')}</StyledTokenHeader>
            <StyledMaxButton onClick={setMax}>
              <Caption>{t('max')}</Caption>
            </StyledMaxButton>
          </StyledTokenInputRow>
          <StyledTokenInputRow>
            <StyledTokenSymbol icon={tokenInfo.CLAM.icon.src}>
              <ContentSmall>{tokenInfo.CLAM.symbol}</ContentSmall>
            </StyledTokenSymbol>
            <StyledInput
              placeholder={t('placeholder')}
              value={clamAmount}
              min={0}
              onChange={e => setClamAmount(e.target.value ?? '')}
            />
          </StyledTokenInputRow>
        </StyledTokenInput>
        <StyledTokenInput>
          <StyledTokenInputRow>
            <StyledTokenHeader>{t('to')}</StyledTokenHeader>
          </StyledTokenInputRow>
          <StyledTokenInputRow>
            <StyledTokenSymbol icon={tokenInfo.FISH.icon.src}>
              <ContentSmall>{tokenInfo.FISH.symbol}</ContentSmall>
            </StyledTokenSymbol>
            <ContentSmall>
              <StyledInput value={trim(fishAmount, 4)} disabled />
            </ContentSmall>
          </StyledTokenInputRow>
        </StyledTokenInput>
      </StyledTokenInputContainer>
      <StyledSwapInfoContainer>
        <StyledSwapInfo>
          <p>1 {tokenInfo.CLAM.symbol}</p>
          <p>
            {fishAmount && clamAmount ? trim(Number(fishAmount) / Number(clamAmount), 4) : '-'} {tokenInfo.FISH.symbol}
          </p>
        </StyledSwapInfo>
      </StyledSwapInfoContainer>
      <PaymentButton
        spenderAddress={OTTOPIA_STORE}
        token={Token.Clam}
        amount={clamAmount ? parseUnits(clamAmount, tokenInfo.CLAM.decimal) : 0}
        Typography={Headline}
        onClick={() => buyFish(parseUnits(clamAmount, tokenInfo.CLAM.decimal))}
        disabled={!clamAmount || !enoughBalance}
      >
        {!clamAmount
          ? t('placeholder')
          : enoughBalance
          ? t('swap')
          : t('not_enough_balance', { symbol: tokenInfo.CLAM.symbol })}
      </PaymentButton>
    </StyledSwap>
  )
}
