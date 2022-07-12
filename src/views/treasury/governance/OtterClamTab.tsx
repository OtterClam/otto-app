import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import Button from 'components/Button'
import { useStake } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useClamBalance from 'hooks/useClamBalance'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'

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

const StyledClamInput = styled.input`
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

interface Props {
  className?: string
}

export default function OtterClamTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const [clamAmount, setClamAmount] = useState('')
  const clamBalance = useClamBalance()
  const { stakeState, stake, resetStake } = useStake()
  const { index } = useTreasuryRealtimeMetrics()
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
      <ContentSmall>
        <StyledClamInput
          placeholder={t('input_placeholder')}
          value={clamAmount}
          onChange={e => setClamAmount(e.target.value)}
        />
      </ContentSmall>
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={stakeState.state !== 'None'}
        onClick={() => stake(clamAmount)}
      >
        {t('stake_btn')}
      </StyledButton>
    </StyledStakeTab>
  )
}
