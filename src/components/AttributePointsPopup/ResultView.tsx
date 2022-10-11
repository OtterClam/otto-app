import styled from "styled-components/macro"
import { Caption, ContentLarge } from "styles/typography"
import arrowImage from './arrow.png'
import OttoCard from "./OttoCard"

const StyledContainer = styled.div``

const StyledName = styled(ContentLarge)``

const StyledDesc = styled(Caption)``

const StyledOttos = styled.div`
  display: flex;
  align-items: center;
`

const StyledArrow = styled.div`
  width: ${arrowImage.width / 2}px;
  height: ${arrowImage.height / 2}px;
  background: center / cover url(${arrowImage.src});
`

export default function ResultView() {
  return (
    <StyledContainer>
      <StyledName>Ta-da! Your Otto seems to have changed a bit.</StyledName>
      <StyledDesc>The more you explore, the stronger you become!</StyledDesc>
      <StyledOttos>
        <OttoCard />
        <StyledArrow />
        <OttoCard />
      </StyledOttos>
    </StyledContainer>
  )
}
