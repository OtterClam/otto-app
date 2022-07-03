import TreasurySection from 'components/TreasurySection'
import styled, { keyframes } from 'styled-components/macro'
import BG from './bg.jpg'
import Otter1 from './clam_pond_otter-1.png'
import Otter2 from './clam_pond_otter-2.png'
import Fountain from './fountain.png'
import StakeDialog from './StakeDialog'
import StakeInfo from './StakeInfo'

const StyledStakePage = styled.div`
  display: flex;
  background: no-repeat center / cover url(${BG.src});
  position: relative;
  overflow-x: hidden;
`

const StyledStakeDialog = styled(StakeDialog)`
  flex: 1;
  margin-top: 140px;
  margin-left: 80px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledStakeInfo = styled(StakeInfo)`
  position: relative;
  margin-bottom: 80px;
`

const Animation = keyframes`
  0%   {opacity: 0;}
  50%  {opacity: 1;}
`

const StyledOtter = styled.img<{ delay: number }>`
  position: absolute;
  width: 468px;
  left: 0;
  bottom: 0;
  z-index: 10;
  animation: ${Animation} 1000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 261px;
  }
`

const StyledFountain = styled.img.attrs({ src: Fountain.src })`
  position: absolute;
  width: 860px;
  right: -150px;
  bottom: 0;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    left: calc(50% - 430px);
  }
`

export default function StakePage() {
  return (
    <TreasurySection showRope={false}>
      <StyledStakePage>
        <StyledFountain />
        <StyledOtter src={Otter1.src} delay={0} />
        <StyledOtter src={Otter2.src} delay={500} />
        <StyledStakeDialog />
        <StyledStakeInfo />
      </StyledStakePage>
    </TreasurySection>
  )
}