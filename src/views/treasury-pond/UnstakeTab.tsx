import dynamic from 'next/dynamic'
import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/tokens/CLAM.svg'
import Button from 'components/Button'
import isAfter from 'date-fns/isAfter'
import formatDate from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import { useClamPondWithdraw, ClamPondToken } from 'contracts/functions'
import { useClamPondFee, useClamPondDepositInfo } from 'contracts/views'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, Note, ContentLarge, ContentSmall, Headline, RegularInput } from 'styles/typography'
import useContractAddresses from 'hooks/useContractAddresses'
import { useWallet } from 'contexts/Wallet'
import ClamInput from './ClamPondInput'
import usePondTokens from './usePondTokens'

const UnstakeSuccessPopup = dynamic(() => import('./UnstakeSuccessPopup'), { ssr: false })

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
  const { CLAM, CLAM_POND } = useContractAddresses()
  const wallet = useWallet()
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const tokens = usePondTokens()
  const [token, setToken] = useState<ClamPondToken>('CLAM')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const { balance, timestamp: lastStakeTimestamp } = useClamPondDepositInfo()
  const { unstakeState: state, unstake, resetState } = useClamPondWithdraw(token)
  const { base: feeBase, fee, feeRate, duration } = useClamPondFee(utils.parseUnits(unstakeAmount || '0', 9))
  const unlockTime = new Date(lastStakeTimestamp.add(duration).mul(1000).toNumber())
  const unlocked = isAfter(new Date(), unlockTime)
  const receiveAmount = utils.parseUnits(unstakeAmount || '0', 9).sub(token === 'CLAM' ? fee : 0)

  useEffect(() => {
    if (state.state === 'Fail' || state.state === 'Exception') {
      window.alert(state.status.errorMessage)
      resetState()
    }
  }, [state, resetState])

  useEffect(() => {
    if (state.state === 'Success') {
      wallet?.setBalance(CLAM, balance => balance.add(receiveAmount))
      wallet?.setBalance(CLAM_POND, balance => balance.sub(receiveAmount))
    }
  }, [state.state])

  return (
    <StyledUnstakeTab className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <StyledPearlBalance>
        {t('available')}
        <StyledPearlBalanceText>
          {balance !== undefined ? trim(utils.formatUnits(balance, 9), 2) : '-'}
        </StyledPearlBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => balance && setUnstakeAmount(utils.formatUnits(balance, 9))}
        >
          {t('max')}
        </Button>
      </StyledPearlBalance>
      <ClamInput
        tokens={tokens}
        selectedToken={tokens[token]}
        value={unstakeAmount}
        onTokenSelected={({ id }) => setToken(id as ClamPondToken)}
        onValueChanged={setUnstakeAmount}
      />
      {token === 'CLAM' && !unlocked && (
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
        onClick={() => unstake(unstakeAmount)}
      >
        {t('unstake_btn')}
      </StyledButton>
      {state.state === 'Success' && (
        <UnstakeSuccessPopup token={token} amount={trim(utils.formatUnits(receiveAmount, 9), 4)} onClose={resetState} />
      )}
    </StyledUnstakeTab>
  )
}
