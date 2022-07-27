import { useEthers, useTokenBalance } from '@usedapp/core'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import USDCIcon from 'assets/tokens/USDC.svg'
import USDPlusIcon from 'assets/tokens/USDPlus.png'
import WMATICIcon from 'assets/tokens/WMATIC.svg'
import ArrowDownIcon from 'assets/ui/arrow_down.svg'
import Button from 'components/Button'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { trim } from 'helpers/trim'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Headline, Note } from 'styles/typography'
import BuyCLAMIcon from './buy-clam.png'
import { use1inchQuote, use1inchSwap } from './1inchHelper'

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

const StyledTokenSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 8px;
  padding: 10px;
  padding-right: 15px;
`

const StyledTokenSelectorRow = styled.div`
  display: flex;
  justify-content: space-between;
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

const StyledSelectTokenButton = styled.button<{ icon: string; enabled: boolean }>`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 14px;
  padding: 2px 5px;

  &:before {
    content: '';
    display: block;
    background: no-repeat center/22px 22px url(${({ icon }) => icon});
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: ${({ theme, enabled }) => (enabled ? theme.colors.lightGray200 : theme.colors.white)};
  }
`

const StyledInput = styled.input`
  min-width: 0px;
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

const StyledLoadingContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
`

const StyledLoadingTitle = styled(ContentLarge).attrs({ as: 'h2' })``

const StyledLoadingDesc = styled(ContentSmall).attrs({ as: 'p' })``

type Token = 'CLAM' | 'USD+' | 'USDC' | 'WMATIC'

interface TokenInfo {
  icon: any
  balance?: BigNumber
  decimal: number
  address: string
}

export default function Swap() {
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup.swap' })
  const { account } = useEthers()
  const slippage = 1
  const [fromToken, setFromToken] = useState<Token>('USDC')
  const [toToken, setToToken] = useState<Token>('CLAM')
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const { swap, swapState, resetSwap } = use1inchSwap()
  const {
    tokens: { CLAM, USDC, USDPlus, WMATIC },
  } = useContractAddresses()
  const clamBalance = useTokenBalance(CLAM, account)
  const usdcBalance = useTokenBalance(USDC, account)
  const usdPlusBalance = useTokenBalance(USDPlus, account)
  const wmaticBalance = useTokenBalance(WMATIC, account)
  const tokens: Record<Token, TokenInfo> = useMemo(
    () => ({
      CLAM: {
        icon: CLAMIcon,
        balance: clamBalance,
        decimal: 9,
        address: CLAM,
      },
      USDC: {
        icon: USDCIcon,
        balance: usdcBalance,
        decimal: 6,
        address: USDC,
      },
      'USD+': {
        icon: USDPlusIcon,
        balance: usdPlusBalance,
        decimal: 6,
        address: USDPlus,
      },
      WMATIC: {
        icon: WMATICIcon,
        balance: wmaticBalance,
        decimal: 18,
        address: WMATIC,
      },
    }),
    [clamBalance, usdcBalance, usdPlusBalance, wmaticBalance, CLAM, USDC, USDPlus, WMATIC]
  )
  const fromTokenInfo = tokens[fromToken]
  const toTokenInfo = tokens[toToken]
  const { amountOut } = use1inchQuote({
    fromToken: fromTokenInfo.address,
    toToken: toTokenInfo.address,
    amount: fromAmount && parseUnits(fromAmount, fromTokenInfo.decimal).toString(),
  })
  useEffect(() => {
    setToAmount(amountOut ? trim(formatUnits(amountOut, toTokenInfo.decimal), 4) : '')
  }, [amountOut, toTokenInfo.decimal])
  const setMax = () => {
    if (fromTokenInfo.balance) {
      setFromAmount(formatUnits(fromTokenInfo.balance, fromTokenInfo.decimal))
    }
  }
  const performSwap = () => {
    if (fromAmount) {
      swap({
        fromToken: fromTokenInfo.address,
        toToken: toTokenInfo.address,
        amount: parseUnits(fromAmount, fromTokenInfo.decimal).toString(),
        slippage,
      })
    }
  }
  const inverseSwap = () => {
    const originFrom = fromToken
    setFromToken(toToken)
    setToToken(originFrom)
  }
  const enoughBalance =
    fromTokenInfo.balance && fromTokenInfo.balance.gte(fromAmount ? parseUnits(fromAmount, fromTokenInfo.decimal) : 0)

  useEffect(() => {
    if (swapState.state === 'Exception' || swapState.state === 'Fail') {
      alert(swapState.status.errorMessage || '')
      resetSwap()
    }
  }, [swapState, resetSwap])

  if (swapState.state !== 'None') {
    let title = ''
    let desc = ''
    switch (swapState.state) {
      case 'Approving':
        title = t('approving_title')
        desc = t('approving_desc', { symbol: fromToken })
        break
      case 'PendingSignature':
        title = t('sign_tx_title')
        desc = t('sign_tx_desc')
        break
      case 'Success':
        title = t('tx_success_title')
        desc = t('tx_success_desc')
        break
      case 'Mining':
      default:
        title = t('tx_sent_title')
        desc = t('tx_sent_desc', { from: fromToken, to: toToken })
    }
    return (
      <StyledLoadingContainer>
        <StyledLoadingTitle>{title}</StyledLoadingTitle>
        <StyledLoadingDesc>{desc}</StyledLoadingDesc>
      </StyledLoadingContainer>
    )
  }

  return (
    <StyledSwap>
      <StyledTitle>{t('title')}</StyledTitle>
      <StyledAvailable>
        {t('available')}
        <StyledAvailableToken src={fromTokenInfo.icon} width="18px" height="18px" />
        <StyledAvailableAmount>{`${trim(
          fromTokenInfo.balance ? formatUnits(fromTokenInfo.balance, fromTokenInfo.decimal) : '-',
          4
        )} ${fromToken}`}</StyledAvailableAmount>
      </StyledAvailable>
      <StyledTokenInputContainer>
        <StyledTokenSelector>
          <StyledTokenSelectorRow>
            <StyledTokenHeader>{t('from')}</StyledTokenHeader>
            <StyledMaxButton onClick={setMax}>
              <Caption>{t('max')}</Caption>
            </StyledMaxButton>
          </StyledTokenSelectorRow>
          <StyledTokenSelectorRow>
            <StyledSelectTokenButton icon={fromTokenInfo.icon.src} enabled={false}>
              <ContentSmall>{fromToken}</ContentSmall>
            </StyledSelectTokenButton>
            <ContentSmall>
              <StyledInput
                placeholder={t('placeholder')}
                value={fromAmount}
                onChange={e =>
                  Number.isNaN(Number(e.target.value)) ? setFromAmount(fromAmount) : setFromAmount(e.target.value)
                }
              />
            </ContentSmall>
          </StyledTokenSelectorRow>
        </StyledTokenSelector>
        <StyledInverseButton onClick={inverseSwap}>
          <Image src={ArrowDownIcon} width="16px" height="16px" />
        </StyledInverseButton>
        <StyledTokenSelector>
          <StyledTokenSelectorRow>
            <StyledTokenHeader>{t('to')}</StyledTokenHeader>
          </StyledTokenSelectorRow>
          <StyledTokenSelectorRow>
            <StyledSelectTokenButton icon={toTokenInfo.icon.src} enabled={false}>
              <ContentSmall>{toToken}</ContentSmall>
            </StyledSelectTokenButton>
            <ContentSmall>
              <StyledInput value={toAmount} disabled />
            </ContentSmall>
          </StyledTokenSelectorRow>
        </StyledTokenSelector>
      </StyledTokenInputContainer>
      <StyledSwapInfoContainer>
        <StyledSwapInfo>
          <p>1 {fromToken}</p>
          <p>
            {toAmount && fromAmount ? trim(Number(toAmount) / Number(fromAmount), 4) : '-'} {toToken}
          </p>
        </StyledSwapInfo>
        <StyledSwapInfo>
          <p>1 {toToken}</p>
          <p>
            {toAmount && fromAmount ? trim(Number(fromAmount) / Number(toAmount), 4) : '-'} {fromToken}
          </p>
        </StyledSwapInfo>
        <StyledSwapInfo>
          <p>{t('swapping_fee', { fee: '1%' })}</p>
          <p>
            {fromAmount ? trim(Number(fromAmount) * 0.01, 4) : '-'} {fromToken}
          </p>
        </StyledSwapInfo>
        <StyledSwapInfo>
          <p>{t('slippage')}</p>
          <p>{slippage}%</p>
        </StyledSwapInfo>
      </StyledSwapInfoContainer>
      <StyledSwapButton Typography={Headline} onClick={performSwap} disabled={!fromAmount || !enoughBalance}>
        {!fromAmount ? t('placeholder') : enoughBalance ? t('swap') : t('not_enough_balance', { symbol: fromToken })}
      </StyledSwapButton>
    </StyledSwap>
  )
}
