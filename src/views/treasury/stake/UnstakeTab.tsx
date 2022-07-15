import PEARL from 'assets/pearl.png'
import PearlCoin from 'assets/icons/PEARL-coin.svg'
import Button from 'components/Button'
import { useWithdraw } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import usePearlBalance from 'hooks/usePearlBalance'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'
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
    background: no-repeat center/contain url(${PEARL.src});
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
  background: url(${PearlCoin.src}) no-repeat 20px;
  text-indent: 32px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledButton = styled(Button)``

// type Tab = 'stake' | 'unstake'

interface Props {
  className?: string
}

export default function UnstakeTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const [pearlAmount, setPearlAmount] = useState('')
  const pearlBalance = usePearlBalance()
  const { unstakeState: state, unstake, resetState } = useWithdraw()
  const { index } = useTreasuryRealtimeMetrics()
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
          {pearlBalance !== undefined ? trim(utils.formatEther(pearlBalance), 2) : '-'}
        </StyledPearlBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => pearlBalance && setPearlAmount(utils.formatEther(pearlBalance))}
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
      {state.state === 'Success' && (
        <UnstakeSuccessPopup
          clamAmount={trim(utils.formatUnits(utils.parseUnits(pearlAmount, 18).mul(index).div(1e9), 18), 4)}
          onClose={resetState}
        />
      )}
    </StyledUnstakeTab>
  )
}
