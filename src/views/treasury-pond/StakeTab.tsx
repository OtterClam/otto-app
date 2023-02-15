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
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  return (
    <StyledStakeTab className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc', { time: new Date('2023-02-16 00:00:00Z').toLocaleString() })}</ContentSmall>
    </StyledStakeTab>
  )
}
