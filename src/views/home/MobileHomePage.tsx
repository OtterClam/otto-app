import Notifications from 'components/Notifications'
import SectionRope from 'components/SectionRope'
import SmallAd from 'components/SmallAd'
import styled from 'styled-components/macro'
import FloatingNavButtons from 'components/FloatingNavButtons'
import { useBreakpoints } from 'contexts/Breakpoints'
import Banner from './Banner'
import { FixedMap } from './Map'

const StyledContainer = styled.div`
  --map-z-index: 0;
  --others-z-index: 1;

  width: 100%;
  position: relative;
  height: var(--game-body-height);
  display: flex;
  flex-direction: column;
`

const StyledTopLayer = styled.div`
  position: absolute;
  z-index: var(--others-z-index);
  left: 10px;
  right: 10px;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 5px;
`

const StyledBannerAndActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: top;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2px;
`

const StyledActionButtons = styled(FloatingNavButtons)`
  pointer-events: auto;
  margin-top: 12px;
`

const StyledBanner = styled(Banner)`
  width: auto;
  max-width: 450px;
  pointer-events: auto;
`

const StyledSmallAd = styled(SmallAd)`
  max-width: 100px;
  pointer-events: auto;
`

const StyledMap = styled(FixedMap)`
  z-index: var(--map-z-index);
`

const StyledNotifications = styled(Notifications)`
  width: 100%;
  max-width: 450px;
  pointer-events: auto;
`

const MobileHomePage = () => {
  const { isSmallTablet, isMobile } = useBreakpoints()

  return (
    <StyledContainer>
      <StyledTopLayer>
        <StyledBannerAndActionsContainer>
          <StyledActionButtons />
          <StyledBanner />
        </StyledBannerAndActionsContainer>
        <StyledNotifications />
        <StyledSmallAd />
      </StyledTopLayer>
      <StyledMap hideCloud={isSmallTablet || isMobile} />
      <SectionRope />
    </StyledContainer>
  )
}

export default MobileHomePage
