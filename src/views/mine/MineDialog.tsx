import CLAMImage from 'assets/clam.svg'
import ArrowDownIcon from 'assets/ui/arrow_down.svg'
import Button from 'components/Button'
import { useWallet } from 'contexts/Wallet'
import { useMine } from 'contracts/functions'
import { useMineInfo } from 'contracts/views'
import { utils } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { trim } from 'helpers/trim'
import { useTokenInfo } from 'hooks/token-info'
import useClamBalance from 'hooks/useClamBalance'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentSmall, Headline, Note, RegularInput } from 'styles/typography'
import { formatUsd } from 'utils/currency'
import FoodaySale from './redemption-presale.jpg'

const StakeSuccessPopup = dynamic(() => import('./StakeSuccessPopup'), { ssr: false })

const StyledMineDialog = styled.div`
  max-width: 360px;
`

const StyledBody = styled.div`
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`

const StyledClamBalance = styled(Caption)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

const StyledClamBalanceText = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    background: no-repeat center/contain url(${CLAMImage.src});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
  }
`

const StyledButton = styled(Button)`
  width: 100%;
`

const StyledTokenInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledTokenInput = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: ${({ disabled }) => (disabled ? '0' : '2px')} solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 8px;
  padding: 10px;
  padding-right: 15px;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray100 : theme.colors.white)};
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

const StyledArrowDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledSwapInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledSwapInfo = styled(Note).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledSwapInfoTokenSymbol = styled.div<{ icon: string }>`
  display: flex;
  gap: 5px;
  align-items: center;

  &:before {
    content: '';
    display: block;
    background: no-repeat url(${({ icon }) => icon});
    background-size: 100% 100%;
    width: 18px;
    height: 18px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.otterBlack};
  }
`

const StyledGashaponTicket = styled.img`
  width: 100%;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
`

interface Props {
  className?: string
}

export default function MineDialog({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mine' })
  const { CLAM, DAI } = useTokenInfo()
  const wallet = useWallet()
  const [clamAmount, setClamAmount] = useState('')
  const clamBalance = useClamBalance()
  const { usdPerClam, deadline, availableSupply, decimals } = useMineInfo()
  const { mineState, mine, resetMine } = useMine()
  const usdAmount = useMemo(
    () =>
      formatUnits(
        parseUnits(clamAmount || '0', CLAM.decimal)
          .mul(usdPerClam || '0')
          .div(utils.parseUnits('1', CLAM.decimal))
          .toString() || '0',
        decimals
      ),
    [clamAmount, usdPerClam, decimals]
  )

  useEffect(() => {
    if (mineState.state === 'Fail' || mineState.state === 'Exception') {
      window.alert(mineState.status.errorMessage)
      resetMine()
    }
    if (mineState.state === 'Success') {
      wallet?.setBalance(CLAM.address, balance => balance.sub(utils.parseUnits(clamAmount, 9)))
    }
  }, [mineState.state])

  return (
    <StyledMineDialog className={className}>
      <StyledBody>
        <Headline as="h1">{t('welcome')}</Headline>
        <ContentSmall as="p">
          {t('desc', { deadline: deadline ? new Date(deadline * 1000).toLocaleString() : '-' })}
        </ContentSmall>
        <StyledTokenInputContainer>
          <StyledClamBalance>
            {t('clam_balance')}
            <StyledClamBalanceText>
              {clamBalance !== undefined ? trim(utils.formatUnits(clamBalance, 9), 2) : '-'}
            </StyledClamBalanceText>
          </StyledClamBalance>
          <StyledTokenInput>
            <StyledTokenInputRow>
              <StyledTokenHeader>{t('from')}</StyledTokenHeader>
              <StyledMaxButton onClick={() => clamBalance && setClamAmount(utils.formatUnits(clamBalance, 9))}>
                <Caption>{t('max')}</Caption>
              </StyledMaxButton>
            </StyledTokenInputRow>
            <StyledTokenInputRow>
              <StyledTokenSymbol icon={CLAMImage.src}>
                <ContentSmall>CLAM</ContentSmall>
              </StyledTokenSymbol>
              <StyledInput
                placeholder={t('placeholder')}
                value={clamAmount}
                min={0}
                onChange={e => setClamAmount(e.target.value ?? '')}
              />
            </StyledTokenInputRow>
          </StyledTokenInput>
          <StyledArrowDown>
            <Image src={ArrowDownIcon} alt="arrow down" />
          </StyledArrowDown>
          <StyledTokenInput disabled>
            <StyledTokenInputRow>
              <StyledTokenHeader>{t('to')}</StyledTokenHeader>
            </StyledTokenInputRow>
            <StyledTokenInputRow>
              <StyledTokenSymbol icon={DAI.icon.src}>
                <ContentSmall>{DAI.symbol}</ContentSmall>
              </StyledTokenSymbol>
              <ContentSmall>
                <StyledInput value={trim(usdAmount, 4)} disabled />
              </ContentSmall>
            </StyledTokenInputRow>
          </StyledTokenInput>
        </StyledTokenInputContainer>
        <StyledSwapInfoContainer>
          <StyledSwapInfo>
            <p>
              <Caption>{t('current_supply')}</Caption>
            </p>
            <p>
              <StyledSwapInfoTokenSymbol icon={DAI.icon.src}>
                <Caption>
                  {availableSupply && formatUsd(formatUnits(availableSupply, decimals))} {DAI.symbol}
                </Caption>
              </StyledSwapInfoTokenSymbol>
            </p>
          </StyledSwapInfo>
          <StyledSwapInfo>
            <p>
              <Caption>1 CLAM</Caption>
            </p>
            <p>
              <Caption>
                = {usdPerClam && formatUnits(usdPerClam, decimals)} {DAI.symbol}
              </Caption>
            </p>
          </StyledSwapInfo>
        </StyledSwapInfoContainer>
        <StyledButton
          Typography={Headline}
          padding="6px"
          isWeb3
          loading={mineState.state !== 'None'}
          onClick={() => mine(clamAmount)}
        >
          {t('mine_btn')}
        </StyledButton>
        <Caption>{t('extra')}</Caption>
        {mineState.state === 'Success' && <StakeSuccessPopup amount={usdAmount} onClose={resetMine} />}
        <a href="https://presale.fooday.app" target="_blank" rel="noreferrer">
          <StyledGashaponTicket src={FoodaySale.src} />
        </a>
      </StyledBody>
    </StyledMineDialog>
  )
}
