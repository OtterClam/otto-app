import useContractAddresses from 'hooks/useContractAddresses'
import { useBreakpoints } from 'contexts/Breakpoints'
import Balance from './balance'
import LargeClamBg from './large-clam.png'
import SmallClamBg from './small-clam.png'
import LargePearlBg from './large-pearl.png'
import SmallPearlBg from './small-pearl.png'
import LargeFishBg from './large-fish.png'
import SmallFishBg from './small-fish.png'

export const ClamBalance = () => {
  const { CLAM } = useContractAddresses()
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallClamBg : LargeClamBg
  const width = isMobile ? 86 : 104
  return <Balance showBuyButton background={bg.src} width={width} contractAddress={CLAM} />
}

export const PearlBalance = () => {
  const { PEARL } = useContractAddresses()
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallPearlBg : LargePearlBg
  const width = isMobile ? 62 : 74
  return <Balance background={bg.src} width={width} contractAddress={PEARL} />
}

export const FishBalance = () => {
  const { PEARL } = useContractAddresses()
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallFishBg : LargeFishBg
  const width = isMobile ? 103 : 121
  return <Balance disabled showBuyButton background={bg.src} width={width} contractAddress={PEARL} />
}
