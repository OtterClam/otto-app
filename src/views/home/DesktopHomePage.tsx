import Notifications from 'components/Notifications'
import SectionRope from 'components/SectionRope'
import SmallAd from 'components/SmallAd'
import TreasurySection from 'components/TreasurySection'
import { MouseRelativePositionProvider } from 'contexts/MouseRelativePosition'
import { Body } from 'layouts/GameLayout'
import styled from 'styled-components/macro'
import FloatingNavButtons from 'components/FloatingNavButtons'
import Banner from './Banner'
import Map from './Map'

const StyledContainer = styled.div`
  --map-z-index: 0;
  --others-z-index: 1;

  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledTopRope = styled(SectionRope)`
  margin-top: calc(var(--header-margin) * -1);
`

const StyledSection = styled(TreasurySection)`
  height: calc(var(--game-body-height) - var(--header-margin));
`

const StyledActionButtons = styled(FloatingNavButtons)`
  position: absolute;
  z-index: var(--others-z-index);
  top: 12px;
  left: 12px;
`

const StyledSmallAd = styled(SmallAd)`
  position: absolute;
  z-index: var(--others-z-index);
  right: 18px;
  top: 191px;
`

const StyledMap = styled(Map)`
  z-index: var(--map-z-index);
`

const StyledBanner = styled(Banner)`
  position: absolute;
  z-index: var(--others-z-index);
  right: 18px;
  top: 0;
`

const StyledNotifications = styled(Notifications)`
  position: absolute;
  z-index: var(--others-z-index);
  right: 18px;
  top: 153px;
`

const DesktopHomePage = () => {
  return (
    <Body>
      <StyledContainer>
        <StyledTopRope />
        <MouseRelativePositionProvider>
          <StyledSection showRope={false}>
            <StyledActionButtons />
            <StyledBanner />
            <StyledNotifications />
            <StyledSmallAd />
            <StyledMap />
          </StyledSection>
        </MouseRelativePositionProvider>
        <SectionRope />
      </StyledContainer>
    </Body>
  )
}

export default DesktopHomePage
