import { useEthers, useTokenBalance } from '@usedapp/core'
import ClamPondIcon from 'assets/icons/icon_48_clam-pond.png'
import PearlBankIcon from 'assets/icons/icon_48_pearl-bank.png'
import CLAMPlusIcon from 'assets/tokens/CLAM+.svg'
import CLAMIcon from 'assets/tokens/CLAM.svg'
import PEARLIcon from 'assets/tokens/PEARL.svg'
import BorderContainer from 'components/BorderContainer'
import { constants } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTranslation } from 'next-i18next'
import { RefObject, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import { formatClam } from 'utils/currency'
import BalanceCell from './BalanceCell'
import Swap from './Swap'

const StyledPopup = styled.div`
  position: fixed;
  top: env(safe-area-inset-top);
  right: env(safe-area-inset-right);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-popup);
`

const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }
`

const StyledWalletPopup = styled.div<{ top: number; left: number }>`
  width: 320px;
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static;
    width: 90%;
  }
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
  show: boolean
  alignRef?: RefObject<HTMLDivElement>
  className?: string
  onClose: () => void
}

export default function WalletPopup({ show, alignRef, className, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'wallet_popup' })
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const { account } = useEthers()
  const clamBalance = useTokenBalance(CLAM, account) || constants.Zero
  const pearlBalance = useTokenBalance(PEARL_BANK, account) || 0
  const clamPlusBalance = useTokenBalance(CLAM_POND, account) || 0
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [show])

  if (!show) return null
  if (typeof document === 'undefined') return null

  const { left, bottom } = alignRef?.current?.getBoundingClientRect() || { left: 0, bottom: 0 }

  const dom = (
    <StyledPopup>
      <StyledBackground onClick={onClose} />
      <StyledWalletPopup className={className} top={bottom} left={left}>
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
    </StyledPopup>
  )

  return ReactDOM.createPortal(dom, document.querySelector('#modal-root') ?? document.body)
}
