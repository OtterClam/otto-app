import { useBreakpoints } from 'contexts/Breakpoints'
import { ethers } from 'ethers'
import { trim } from 'helpers/trim'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import useContractAddresses from 'hooks/useContractAddresses'
import { useTokenInfo } from 'hooks/token-info'
import useTokenBalance from 'hooks/useTokenBalance'
import localforage from 'localforage'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import styled, { useTheme } from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import { formatClamEthers } from 'utils/currency'
import Balance from './balance'

const LargeClamBg = '/images/header/header_clam_xl.png'
const SmallClamBg = '/images/header/header_clam_xs.png'
const LargeMaticBg = '/images/header/header_matic_xl.png'
const SmallMaticBg = '/images/header/header_matic_xs.png'
const LargeFishBg = '/images/header/large-fish.png'
const SmallFishBg = '/images/header/small-fish.png'

const DynamicReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const StyledToolTip = styled(DynamicReactTooltip)`
  background: ${({ theme }) => theme.colors.clamPink};
  padding: 1px 10px !important;
  opacity: 1 !important;
  border-radius: 5px !important;
`

interface Props {
  onClick: () => void
}

const NEW_WALLET_TOOLTIP_SHOWED = 'new-wallet-tooltip-showed'

const useNewWalletTooltipShowed = () => {
  const [newWalletTooltipShowed, setNewWalletTooltipShowed] = useState(false)

  useBrowserLayoutEffect(() => {
    localforage
      .getItem(NEW_WALLET_TOOLTIP_SHOWED)
      .catch(err => console.warn('failed to get data from storage', err))
      .then(data => setNewWalletTooltipShowed(Boolean(data)))
  }, [])

  return {
    newWalletTooltipShowed,
    setNewWalletTooltipShowed: (newVal: boolean) => {
      setNewWalletTooltipShowed(true)
      localforage.setItem(NEW_WALLET_TOOLTIP_SHOWED, true)
    },
  }
}

export const ClamBalance = ({ onClick }: Props) => {
  const { newWalletTooltipShowed, setNewWalletTooltipShowed } = useNewWalletTooltipShowed()
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const theme = useTheme()
  const tooltipRef = useRef(null)
  const clamBalance = useTokenBalance(CLAM)
  const pearlBalance = useTokenBalance(PEARL_BANK)
  const clamPlusBalance = useTokenBalance(CLAM_POND)
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallClamBg : LargeClamBg
  const width = isMobile ? 108 : 128
  const balance = useMemo(
    () => formatClamEthers(clamBalance?.add(pearlBalance || 0)?.add(clamPlusBalance) || 0, 2),
    [clamBalance, pearlBalance, clamPlusBalance]
  )
  useEffect(() => {
    tooltipRef?.current && ReactTooltip.show(tooltipRef.current)
  }, [tooltipRef])
  return (
    <div data-tip ref={tooltipRef}>
      <Balance
        background={bg}
        width={width}
        balance={balance}
        onClick={() => {
          setNewWalletTooltipShowed(true)
          onClick()
        }}
      />
      {!newWalletTooltipShowed && (
        <StyledToolTip
          place="bottom"
          effect="solid"
          backgroundColor={theme.colors.clamPink}
          arrowColor={theme.colors.clamPink}
          offset={{ top: 4 }}
        >
          <ContentMedium>New!</ContentMedium>
        </StyledToolTip>
      )}
    </div>
  )
}

export const MaticBalance = ({ onClick }: Props) => {
  const { isMobile } = useBreakpoints()
  const tokenInfo = useTokenInfo()
  const bg = isMobile ? SmallMaticBg : LargeMaticBg
  const width = isMobile ? 108 : 128
  return (
    <Balance
      background={bg}
      width={width}
      balance={trim(ethers.utils.formatEther(tokenInfo.MATIC.balance || '0'), 4)}
      onClick={onClick}
    />
  )
}

export const FishBalance = ({ onClick }: Props) => {
  const { isMobile } = useBreakpoints()
  const { FISH } = useContractAddresses()
  const bg = isMobile ? SmallFishBg : LargeFishBg
  const width = isMobile ? 103 : 155
  const fishBalance = useTokenBalance(FISH)
  return (
    <Balance
      showBuyButton
      background={bg}
      width={width}
      balance={trim(ethers.utils.formatEther(fishBalance), 4)}
      onClick={onClick}
    />
  )
}
