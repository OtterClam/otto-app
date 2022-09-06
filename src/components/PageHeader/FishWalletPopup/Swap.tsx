import ArrowDownIcon from 'assets/ui/arrow_down.svg'
import Button from 'components/Button'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { trim } from 'helpers/trim'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Headline, Note, RegularInput } from 'styles/typography'
import { useBuyFishReturn } from 'contracts/views'
import { useBuyFish } from 'contracts/functions'
import PaymentButton from 'components/PaymentButton'
import useContractAddresses from 'hooks/useContractAddresses'
import { Token } from 'constant'
import { useTokenInfo } from './token-info'
import SwapLoading from './SwapLoading'
import BuyCLAMIcon from './buy-clam.png'

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
    background: center / 43px 38px url(${BuyCLAMIcon.src}) no-repeat;
  }
  &:after {
    width: 43px;
    content: ' ';
    background: center / 43px 38px url(${BuyCLAMIcon.src}) no-repeat;
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

const StyledSelectTokenButton = styled.button<{ icon: string }>`
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

  &::after {
    display: ${({ disabled }) => (disabled ? 'none' : 'block')};
    content: '';
    width: 12px;
    height: 12px;
    background: url(${ArrowDownIcon.src}) no-repeat center/12px 12px;
  }

  &:hover {
    background: ${({ theme, disabled }) => (disabled ? theme.colors.white : theme.colors.lightGray200)};
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

const StyledInverseButton = styled.button`
  display: flex;
  justify-content: center;
  padding: 6px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  position: absolute;
  left: calc(50% - 14px);
  top: calc(50% - 14px);
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

const StyledSwapButton = styled(Button)`
  margin-top: 10px;
`

const StyledTokenSelector = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: absolute;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px 0;
`

const StyledSelectTokenRow = styled.button`
  display: flex;
  padding: 0 10px;
  gap: 5px;
  align-items: center;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.colors.lightGray200};
  }
`

const StyledSelectTokenRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

const StyledSelectTokenName = styled(ContentSmall)``

const StyledSelectTokenAmount = styled(Note)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyledPoweredBy = styled(Note)`
  width: 100%;
  color: ${({ theme }) => theme.colors.darkGray100};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

interface Props {
  onClose: () => void
}

export default function Swap({ onClose }: Props) {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup.swap' })
  const [clamAmount, setClamAmount] = useState<string>('0')
  const { buyFishState, buyFish, resetBuyFish } = useBuyFish()
  const tokenInfo = useTokenInfo()
  const fishReturn = useBuyFishReturn(clamAmount)
  const fishAmount = useMemo(() => trim(formatUnits(tokenInfo.FISH.balance, tokenInfo.FISH.decimal), 4), [fishReturn])
  const enoughBalance =
    tokenInfo.CLAM.balance &&
    tokenInfo.CLAM.balance.gte(clamAmount ? parseUnits(clamAmount, tokenInfo.CLAM.decimal) : 0)
  const swapState = useMemo(
    () => ({
      ...buyFishState,
      outAmount: fishAmount,
    }),
    [buyFishState, fishAmount]
  )

  const setMax = () => {
    setClamAmount(trim(formatUnits(tokenInfo.CLAM.balance, tokenInfo.CLAM.decimal), 4))
  }

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
        <StyledAvailableAmount>{`${
          tokenInfo.CLAM.balance ? trim(formatUnits(tokenInfo.CLAM.balance, tokenInfo.CLAM.decimal), 4) : '-'
        } ${tokenInfo.CLAM.symbol}`}</StyledAvailableAmount>
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
            <StyledSelectTokenButton icon={tokenInfo.CLAM.icon.src}>
              <ContentSmall>{tokenInfo.CLAM.symbol}</ContentSmall>
            </StyledSelectTokenButton>
            <StyledInput
              placeholder={t('placeholder')}
              value={clamAmount}
              onChange={e =>
                Number.isNaN(Number(e.target.value)) ? setClamAmount(clamAmount) : setClamAmount(e.target.value)
              }
            />
          </StyledTokenInputRow>
        </StyledTokenInput>
        <StyledTokenInput>
          <StyledTokenInputRow>
            <StyledTokenHeader>{t('to')}</StyledTokenHeader>
          </StyledTokenInputRow>
          <StyledTokenInputRow>
            <StyledSelectTokenButton icon={tokenInfo.FISH.icon.src}>
              <ContentSmall>{tokenInfo.FISH.symbol}</ContentSmall>
            </StyledSelectTokenButton>
            <ContentSmall>
              <StyledInput value={fishAmount} disabled />
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
        <StyledSwapInfo>
          <p>1 {tokenInfo.FISH.symbol}</p>
          <p>
            {fishAmount && clamAmount ? trim(Number(clamAmount) / Number(fishAmount), 4) : '-'} {tokenInfo.CLAM.symbol}
          </p>
        </StyledSwapInfo>
      </StyledSwapInfoContainer>
      <PaymentButton
        spenderAddress={OTTOPIA_STORE}
        token={Token.Clam}
        amount={parseUnits(clamAmount, tokenInfo.CLAM.decimal)}
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
