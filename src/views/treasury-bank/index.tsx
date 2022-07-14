import TreasurySection from 'components/TreasurySection'
import styled, { keyframes } from 'styled-components/macro'
import BG from './bg.jpg'
import Otto from './otto.png'
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
  margin-top: 100px;
  margin-left: 80px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledStakeInfo = styled(StakeInfo)`
  position: relative;
  margin-bottom: 30px;
`

const Animation = keyframes`
  0%   { background-position: left top }
  50%  { background-position: right top }
`

const StyledOtter = styled.div`
  position: absolute;
  width: 352px;
  height: 314px;
  left: 0;
  bottom: 0;
  z-index: 10;
  animation: ${Animation} 2000ms steps(1) infinite;
  background: left top / 704px 314px url(${Otto.src});

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 210px;
    height: 188px;
  }
`

const StyledFountain = styled.img.attrs({ src: Fountain.src })`
  position: absolute;
  width: 860px;
  right: -150px;
  bottom: 0;
  height: 190px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    left: calc(50% - 430px);
  }
`

export default function StakePage() {
  return (
    <TreasurySection showRope={false}>
      <StyledStakePage>
        <StyledFountain />
        <StyledOtter />
        <StyledStakeDialog />
        <StyledStakeInfo />
      </StyledStakePage>
    </TreasurySection>
  )
}
