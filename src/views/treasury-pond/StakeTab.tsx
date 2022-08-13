import Button from 'components/Button'
import { useWallet } from 'contexts/Wallet'
import { ClamPondToken, useClamPondDeposit } from 'contracts/functions'
import { useClamPondFee } from 'contracts/views'
import formatDate from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline, Note } from 'styles/typography'
import ClamPondInput from './ClamPondInput'
import usePondTokens from './usePondTokens'

const StakeSuccessPopup = dynamic(() => import('./StakeSuccessPopup'), { ssr: false })

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

const StyledClamBalanceText = styled.div<{ icon: string }>`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    background: no-repeat center/contain url(${({ icon }) => icon});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
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
  const { CLAM } = useContractAddresses()
  const wallet = useWallet()
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const tokens = usePondTokens()
  const [stakeAmount, setStakeAmount] = useState('')
  const [token, setToken] = useState<ClamPondToken>('CLAM')
  const { stakeState, stake, resetStake } = useClamPondDeposit(token)
  const { base: feeBase, feeRate, duration } = useClamPondFee()
  const { balance } = tokens[token]
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
        <StyledClamBalanceText icon={tokens[token].smallIcon}>
          {balance !== undefined ? trim(utils.formatUnits(balance, 9), 2) : '-'}
        </StyledClamBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => balance && setStakeAmount(utils.formatUnits(balance, 9))}
        >
          {t('max')}
        </Button>
      </StyledClamBalance>
      <ClamPondInput
        tokens={tokens}
        selectedToken={tokens[token]}
        value={stakeAmount}
        onTokenSelected={({ id }) => setToken(id as ClamPondToken)}
        onValueChanged={setStakeAmount}
      />
      {token === 'CLAM' && (
        <>
          <StyledField>
            <StyledFieldLabel>
              {t('fee', { feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2) })}
            </StyledFieldLabel>
          </StyledField>
          <StyledNote>
            {t('stake_note', {
              feeRate: trim((feeRate.toNumber() / feeBase.toNumber()) * 100, 2),
              date: formatDate(unlockTime, 'yyyy-MM-dd'),
              days: formatDistanceToNowStrict(unlockTime, { unit: 'day' }),
            })}
          </StyledNote>
        </>
      )}
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={stakeState.state !== 'None'}
        onClick={() => {
          stake(stakeAmount)
          wallet?.setBalance(CLAM, balance => balance.sub(utils.parseUnits(stakeAmount, 9)))
        }}
      >
        {t('stake_btn')}
      </StyledButton>
      {stakeState.state === 'Success' && (
        <StakeSuccessPopup
          clamAmount={trim(utils.formatUnits(utils.parseUnits(stakeAmount, 9), 9), 4)}
          onClose={resetStake}
        />
      )}
    </StyledStakeTab>
  )
}
