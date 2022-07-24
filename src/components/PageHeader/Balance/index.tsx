import useContractAddresses from 'hooks/useContractAddresses'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { formatClam } from 'utils/currency'
import { useMemo } from 'react'
import { constants } from 'ethers'
import Balance from './balance'
import LargeClamBg from './large-clam-normal.png'
import LargeClamHoverBg from './large-clam-hover.png'
import SmallClamBg from './small-clam-normal.png'
import SmallClamHoverBg from './small-clam-hover.png'
import LargeFishBg from './large-fish.png'
import SmallFishBg from './small-fish.png'

export const ClamBalance = () => {
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const { account } = useEthers()
  const clamBalance = useTokenBalance(CLAM, account) || constants.Zero
  const pearlBalance = useTokenBalance(PEARL_BANK, account) || 0
  const clamPlusBalance = useTokenBalance(CLAM_POND, account) || 0
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallClamBg : LargeClamBg
  const hover = isMobile ? SmallClamHoverBg : LargeClamHoverBg
  const width = isMobile ? 108 : 128
  const balance = useMemo(
    () => formatClam(clamBalance?.add(pearlBalance || 0)?.add(clamPlusBalance) || 0, 2),
    [clamBalance, pearlBalance, clamPlusBalance]
  )
  return <Balance showBuyButton background={bg.src} hover={hover.src} width={width} balance={balance} />
}

export const FishBalance = () => {
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallFishBg : LargeFishBg
  const width = isMobile ? 103 : 155
  return <Balance disabled showBuyButton background={bg.src} hover={bg.src} width={width} balance="--" />
}
