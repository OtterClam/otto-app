import TreasurySection from 'components/TreasurySection'
import styled, { keyframes } from 'styled-components/macro'
import BG from './bg.jpg'
import Otto from './otto.png'
import StakeDialog from './StakeDialog'
import StakeInfo from './StakeInfo'

const StyledTreasurySection = styled(TreasurySection)`
  margin-top: 4px;
  height: var(--body-height);
  display: flex;
  align-item: stretch;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    height: calc(var(--body-height) - 84px);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    overflow: unset;
    height: unset;
    align-item: unset;
  }
`

const StyledStakePage = styled.div`
  background: no-repeat center / cover url(${BG.src});
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    overflow: unset;
  }
`

const StyledStakePageInner = styled.div`
  flex: 1 100%;
  display: flex;
`

const StyledStakeDialog = styled(StakeDialog)`
  flex: 1;
  margin-top: 60px;
  margin-left: 80px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledStakeInfo = styled(StakeInfo)`
  position: relative;
`

const Animation = keyframes`
  0%   { background-position: left top }
  50%  { background-position: right top }
`

const StyledOtter = styled.div`
  position: fixed;
  width: 352px;
  height: 314px;
  left: 50%;
  bottom: 0;
  z-index: 10;
  transform: translate(-600px);
  animation: ${Animation} 2000ms steps(1) infinite;
  background: left top / 200% 100% url(${Otto.src});

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: absolute;
    left: 0;
    transform: unset;
    width: 210px;
    height: 188px;
  }
`

export default function StakePage() {
  return (
    <StyledTreasurySection showRope={false}>
      <StyledStakePage>
        <StyledStakePageInner>
          <StyledOtter />
          <StyledStakeDialog />
          <StyledStakeInfo />
        </StyledStakePageInner>
      </StyledStakePage>
    </StyledTreasurySection>
  )
}
