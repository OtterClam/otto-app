import dynamic from 'next/dynamic'
import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/tokens/CLAM.svg'
import Button from 'components/Button'
import formatDate from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import isAfter from 'date-fns/isAfter'
import { useUnstake, useStakedInfo } from 'contracts/functions'
import { usePearlBankFee } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, Note, ContentLarge, ContentSmall, Headline, RegularInput } from 'styles/typography'

const UnstakeSuccessPopup = dynamic(() => import('./UnstakeSuccessPopup'), { ssr: false })

const StyledUnstakeTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledStakedClamAmount = styled(Caption)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

const StyledStakedClamAmountText = styled.div`
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

const StyledInput = styled(RegularInput)`
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

interface Props {
  className?: string
}

export default function UnstakeTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'bank' })
  const [clamAmount, setClamAmount] = useState('')
  const { amount: stakedAmount, timestamp: lastStakeTimestamp } = useStakedInfo()
  const { unstakeState: state, unstake, resetState } = useUnstake()
  const { base: feeBase, fee, feeRate, duration } = usePearlBankFee(utils.parseUnits(clamAmount || '0', 9))
  const unlockTime = new Date(lastStakeTimestamp.add(duration).mul(1000).toNumber())
  const unlocked = isAfter(new Date(), unlockTime)
  const receiveAmount = utils.parseUnits(clamAmount || '0', 9).sub(fee)

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
      <StyledStakedClamAmount>
        {t('available')}
        <StyledStakedClamAmountText>
          {!stakedAmount.eq(0) ? trim(utils.formatUnits(stakedAmount, 9), 2) : '-'}
        </StyledStakedClamAmountText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => !stakedAmount.eq(0) && setClamAmount(utils.formatUnits(stakedAmount, 9))}
        >
          {t('max')}
        </Button>
      </StyledStakedClamAmount>
      <StyledInput
        placeholder={t('input_placeholder')}
        value={clamAmount}
        type="number"
        onChange={e => setClamAmount(Number.isNaN(Number(e.target.value)) ? '' : e.target.value)}
      />
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
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={state.state !== 'None'}
        onClick={() => unstake(clamAmount)}
      >
        {t('unstake_btn')}
      </StyledButton>
      {state.state === 'Success' && (
        <UnstakeSuccessPopup clamAmount={trim(utils.formatUnits(receiveAmount, 9), 4)} onClose={resetState} />
      )}
    </StyledUnstakeTab>
  )
}
