import TreasurySection from 'components/TreasurySection'
import styled, { keyframes } from 'styled-components/macro'
import BG from './bg.jpg'
import Otter1 from './clam_pond_otter-1.png'
import Otter2 from './clam_pond_otter-2.png'
import Fountain from './fountain.png'
import StakeDialog from './StakeDialog'
import StakeInfo from './StakeInfo'

const StyledStakePage = styled.div`
  z-index: 0;
  display: flex;
  background: no-repeat center / cover url(${BG.src});
  position: relative;
  overflow-x: hidden;

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    right: -150px;
    bottom: 0;
    width: 78%;
    padding-bottom: 22.093023255813954%;
    background: center / 100% url(${Fountain.src});

    @media ${({ theme }) => theme.breakpoints.mobile} {
      right: unset;
      left: 50%;
      width: 150%;
      transform: translate(-50%);
    }
  }
`

const StyledStakeDialog = styled(StakeDialog)`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledStakeDialogContainer = styled.div`
  flex: 1 50%;
  box-sizing: border-box;
  padding: 100px 24px 48px 74px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledStakeInfo = styled(StakeInfo)`
  flex: 1 50%;
  position: relative;
  margin-bottom: 30px;
`

const Animation = keyframes`
  0%   {opacity: 0;}
  50%  {opacity: 1;}
`

const StyledOtter = styled.img<{ delay: number }>`
  position: fixed;
  width: 418px;
  left: 50%;
  bottom: 0;
  z-index: 10;
  transform: translate(-600px);
  animation: ${Animation} 2000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: absolute;
    left: 0;
    transform: unset;
    width: 210px;
  }
`

export default function StakePage() {
  return (
    <TreasurySection showRope={false}>
      <StyledStakePage>
        <StyledOtter src={Otter1.src} delay={0} />
        <StyledOtter src={Otter2.src} delay={1000} />
        <StyledStakeDialogContainer>
          <StyledStakeDialog />
        </StyledStakeDialogContainer>
        <StyledStakeInfo />
      </StyledStakePage>
    </TreasurySection>
  )
}
