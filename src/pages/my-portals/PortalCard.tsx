import BorderContainer from 'components/BorderContainer'
import styled from 'styled-components'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'
import { theme } from 'styles'
import ProgressBar from 'components/ProgressBar'
import PortalImage from './Portalortal-light.png'
import ClockImage from './clock.png'

const StyledPortalCard = styled(BorderContainer)`
  width: 265px;
  height: 448px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 12px;
`

const StyledPortalImage = styled.img`
  width: 225px;
  height: 225px;
`

const StyledPortalTitle = styled.div``

const StyledPortalStatus = styled.div``

const StyledCountdown = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray200};

  &::before {
    content: '';
    background: url(${ClockImage});
    background-size: contain;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

const StyledProgressBar = styled(ProgressBar)`
  width: 225px;
  border-radius: 6px;
`

export default function PortalCard() {
  return (
    <StyledPortalCard borderColor={theme.colors.clamPink}>
      <StyledPortalImage src={PortalImage} />
      <StyledPortalTitle>
        <ContentMedium>#128 Opened Otto Portal</ContentMedium>
      </StyledPortalTitle>
      <StyledPortalStatus>
        <ContentSmall>
          The portal is opened, but only the summoned Otto can get through the portal and join the Otterverse adventure.
        </ContentSmall>
      </StyledPortalStatus>
      <StyledProgressBar height="12px" progress={58} />
      <StyledCountdown>
        <Caption>5 d. 18 hr. 13 min. 29 sec. left</Caption>
      </StyledCountdown>
    </StyledPortalCard>
  )
}
