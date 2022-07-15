import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import Button from 'components/Button'
import isAfter from 'date-fns/isAfter'
import formatDate from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import { useWithdraw, useDepositedAmount, useClamPondFee, useDepositInfo } from 'contracts/functions'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, Note, ContentLarge, ContentSmall, Headline } from 'styles/typography'
import UnstakeSuccessPopup from './UnstakeSuccessPopup'

const StyledUnstakeTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledPearlBalance = styled(Caption)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

const StyledPearlBalanceText = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    background: no-repeat center/contain url(${CLAM.src});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
  }
`

const StyledInput = styled.input`
  width: 100%;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: url(${CLAMCoin.src}) no-repeat 20px;
  text-indent: 32px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledField = styled.div`
  display: flex;
  align-items: center;
`

const StyledFieldLabel = styled(Caption)`
  flex: 1;
`

const StyledFieldValue = styled(Caption)`
  flex: 1;
  text-align: right;
`

const StyledNote = styled(Note)`
  border-radius: 8px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.lightGray200};
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyledButton = styled(Button)``

// type Tab = 'stake' | 'unstake'

interface Props {
  className?: string
}

export default function UnstakeTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const [pearlAmount, setPearlAmount] = useState('')
  const pearlBalance = useDepositedAmount()
  const { unstakeState: state, unstake, resetState } = useWithdraw()
  const { base: feeBase, fee, feeRate, duration } = useClamPondFee(utils.parseUnits(pearlAmount || '0', 9))
  const { timestamp: lastStakeTimestamp } = useDepositInfo()
  const unlockTime = new Date(lastStakeTimestamp.add(duration).mul(1000).toNumber())
  const unlocked = isAfter(new Date(), unlockTime)
  const receiveAmount = utils.parseUnits(pearlAmount || '0', 9).sub(fee)

  useEffect(() => {
    if (state.state === 'Fail' || state.state === 'Exception') {
      window.alert(state.status.errorMessage)
      resetState()
    }
  }, [state, resetState])

  return (
    <StyledUnstakeTab className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <StyledPearlBalance>
        {t('available')}
        <StyledPearlBalanceText>
          {pearlBalance !== undefined ? trim(utils.formatUnits(pearlBalance, 9), 2) : '-'}
        </StyledPearlBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => pearlBalance && setPearlAmount(utils.formatUnits(pearlBalance, 9))}
        >
          {t('max')}
        </Button>
      </StyledPearlBalance>
      <ContentSmall>
        <StyledInput
          placeholder={t('input_placeholder')}
          value={pearlAmount}
          onChange={e => setPearlAmount(e.target.value)}
        />
      </ContentSmall>
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={state.state !== 'None'}
        onClick={() => unstake(pearlAmount)}
      >
        {t('unstake_btn')}
      </StyledButton>
      {!unlocked && (
        <>
          <StyledField>
            <StyledFieldLabel>
              {t('fee', { feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2) })}
            </StyledFieldLabel>
            <StyledFieldValue>-{trim(utils.formatUnits(fee, 9), 4)} CLAM</StyledFieldValue>
          </StyledField>
          <StyledNote>
            {t('unstake_note', {
              feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2),
              date: formatDate(unlockTime, 'yyyy-MM-dd'),
              days: formatDistanceToNowStrict(unlockTime, { unit: 'day' }),
            })}
          </StyledNote>
          <StyledField>
            <StyledFieldLabel>{t('unstake_receive_amount')}</StyledFieldLabel>
            <StyledFieldValue>{trim(utils.formatUnits(receiveAmount, 9), 4)} CLAM</StyledFieldValue>
          </StyledField>
        </>
      )}
      {state.state === 'Success' && (
        <UnstakeSuccessPopup
          clamAmount={trim(utils.formatUnits(utils.parseUnits(pearlAmount, 9), 9), 4)}
          onClose={resetState}
        />
      )}
    </StyledUnstakeTab>
  )
}
