import { useEthers, useTokenBalance } from '@usedapp/core'
import BorderContainer from 'components/BorderContainer'
import { constants } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import { formatClam } from 'utils/currency'
import ClamPondIcon from 'assets/icons/icon_48_clam-pond.png'
import PearlBankIcon from 'assets/icons/icon_48_pearl-bank.png'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import CLAMPlusIcon from 'assets/tokens/CLAM+.svg'
import PEARLIcon from 'assets/tokens/PEARL.svg'
import BalanceCell from './BalanceCell'
import Swap from './Swap'

const StyledWalletPopup = styled.div`
  width: 320px;
`

const StyledBorderContainer = styled(BorderContainer)`
  overflow: hidden;
`

const StyledBalancesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  padding: 12px 12px 15px 12px;
`

const StyledBalanceTitle = styled(Caption).attrs({ as: 'h2' })`
  text-align: center;
`

const StyledBalanceCells = styled.div`
  display: flex;
  gap: 10px;
`

const StyledBalanceCell = styled(BalanceCell)`
  flex: 1;
`

const StyledSwap = styled(Swap)``

interface Props {
  className?: string
}

export default function WalletPopup({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup' })
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const { account } = useEthers()
  const clamBalance = useTokenBalance(CLAM, account) || constants.Zero
  const pearlBalance = useTokenBalance(PEARL_BANK, account) || 0
  const clamPlusBalance = useTokenBalance(CLAM_POND, account) || 0
  return (
    <StyledWalletPopup className={className}>
      <StyledBorderContainer size="xs">
        <StyledBalancesContainer>
          <StyledBalanceTitle>{t('balance_title')}</StyledBalanceTitle>
          <StyledBalanceCells>
            <StyledBalanceCell name={t('wallet')} balance={formatClam(clamBalance, 2)} balanceIcon={CLAMIcon.src} />
            <StyledBalanceCell
              name={t('clam_pond')}
              icon={ClamPondIcon.src}
              balance={formatClam(clamPlusBalance, 2)}
              balanceIcon={CLAMPlusIcon.src}
            />
            <StyledBalanceCell
              name={t('pearl_bank')}
              icon={PearlBankIcon.src}
              balance={formatClam(pearlBalance, 2)}
              balanceIcon={PEARLIcon.src}
            />
          </StyledBalanceCells>
        </StyledBalancesContainer>
        <StyledSwap />
      </StyledBorderContainer>
    </StyledWalletPopup>
  )
}
