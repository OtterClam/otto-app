import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/tokens/CLAM.svg'
import Button from 'components/Button'
import { useStake } from 'contracts/functions'
import { usePearlBankFee } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useClamBalance from 'hooks/useClamBalance'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline, Note, RegularInput } from 'styles/typography'
import formatDate from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import StakeSuccessPopup from './StakeSuccessPopup'

const StyledStakeTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    background: no-repeat center/contain url(${CLAM.src});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
  }
`

const StyledClamInput = styled(RegularInput)`
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

const StyledButton = styled(Button)``

const StyledField = styled.div`
  display: flex;
  align-items: center;
`

const StyledFieldLabel = styled(Caption)`
  flex: 1;
`

const StyledNote = styled(Note)`
  border-radius: 8px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.lightGray200};
  color: ${({ theme }) => theme.colors.darkGray200};
`

interface Props {
  className?: string
}

export default function StakeTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'bank' })
  const [clamAmount, setClamAmount] = useState('')
  const clamBalance = useClamBalance()
  const { stakeState, stake, resetStake } = useStake()
  const { base: feeBase, fee, feeRate, duration } = usePearlBankFee(utils.parseUnits(clamAmount || '0', 9))
  const unlockTime = useMemo(() => new Date(Date.now() + duration * 1000), [duration])
  useEffect(() => {
    if (stakeState.state === 'Fail' || stakeState.state === 'Exception') {
      window.alert(stakeState.status.errorMessage)
      resetStake()
    }
  }, [stakeState, resetStake])
  return (
    <StyledStakeTab className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <StyledClamBalance>
        {t('available')}
        <StyledClamBalanceText>
          {clamBalance !== undefined ? trim(utils.formatUnits(clamBalance, 9), 2) : '-'}
        </StyledClamBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => clamBalance && setClamAmount(utils.formatUnits(clamBalance, 9))}
        >
          {t('max')}
        </Button>
      </StyledClamBalance>
      <StyledClamInput
        placeholder={t('input_placeholder')}
        value={clamAmount}
        type="number"
        onChange={e => setClamAmount(Number.isNaN(e.target.value) ? '' : e.target.value)}
      />
      <StyledField>
        <StyledFieldLabel>
          {t('fee', { feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2) })}
        </StyledFieldLabel>
      </StyledField>
      <StyledNote>
        {t('unstake_note', {
          feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2),
          date: formatDate(unlockTime, 'yyyy-MM-dd'),
          days: formatDistanceToNowStrict(unlockTime, { unit: 'day' }),
        })}
      </StyledNote>
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={stakeState.state !== 'None'}
        onClick={() => stake(clamAmount)}
      >
        {t('stake_btn')}
      </StyledButton>
      {stakeState.state === 'Success' && (
        <StakeSuccessPopup
          clamAmount={trim(utils.formatUnits(utils.parseUnits(clamAmount, 9), 9), 4)}
          onClose={resetStake}
        />
      )}
    </StyledStakeTab>
  )
}
