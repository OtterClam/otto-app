import DefaultMetaTags from 'components/DefaultMetaTags'
import TreasurySection from 'components/TreasurySection'
import styled, { keyframes } from 'styled-components/macro'
import BG from './bg.jpg'
import Otto from './otto.png'
import MineDialog from './MineDialog'

const StyledTreasurySection = styled(TreasurySection)`
  margin-top: 4px;
  width: 100%;
  height: var(--body-height);
  display: flex;
  align-items: stretch;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    height: calc(var(--body-height) - 84px);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    overflow: unset;
    height: calc(var(--body-height) - 34px);
    align-item: unset;
  }
`

const StyledMinePage = styled.div`
  width: 100%;
  background: no-repeat center / cover url(${BG.src});
  position: relative;
  overflow-y: scroll;
`

const StyledMinePageInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    height: unset;
  }
`

const StyledMineDialog = styled(MineDialog)`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 34px;
    padding-bottom: 180px;
  }
`

const Animation = keyframes`
  0%   { background-position: left top }
  50%  { background-position: right top }
`

const StyledOtter = styled.div`
  position: absolute;
  width: 352px;
  height: 314px;
  left: 50%;
  bottom: 0;
  z-index: 10;
  transform: translate(-600px);
  animation: ${Animation} 2000ms steps(1) infinite;
  background: left top / 200% 100% url(${Otto.src});
  pointer-events: none;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    position: absolute;
    left: 0;
    transform: unset;
    width: 210px;
    height: 188px;
  }
`

export default function MinePage() {
  return (
    <StyledTreasurySection showRope={false}>
      <DefaultMetaTags />
      <StyledMinePage>
        <StyledMinePageInner>
          <StyledMineDialog />
        </StyledMinePageInner>
      </StyledMinePage>
      <StyledOtter />
    </StyledTreasurySection>
  )
}
