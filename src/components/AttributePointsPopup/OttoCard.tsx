import AdventureProgressBar from "components/AdventureProgressBar"
import CroppedImage from "components/CroppedImage"
import { AdventureOtto } from "models/AdventureOtto"
import Otto from "models/Otto"
import styled from "styled-components/macro"
import { ContentExtraSmall, Note } from "styles/typography"

const StyledOttoCard = styled.div``

const StyledImage = styled.div`
  position: relative;
  width: 100%;

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const StyledName = styled(ContentExtraSmall)``

const StyledExp = styled.div``

const StyledLevel = styled.div``

const StyledTitle = styled.div``

const StyedAttrs = styled(Note)`
  display: grid;
  grid-template-columns: repeat(2, 118px);
  column-gap: 20px;
`

const StyledAttr = styled.div``

const StyledType = styled.div``

const StyledValue = styled.div``

export interface OttoCardProps {
  otto: Otto
  adventureOtto: AdventureOtto
  points: { [k: string]: number }
}

export default function OttoCard({ otto, adventureOtto, points }: OttoCardProps) {
  return (
    <StyledOttoCard>
      <StyledImage>
        <CroppedImage src={adventureOtto.image} />
      </StyledImage>
      <StyledName>{otto.name}</StyledName>
      <StyledLevel>
        LV.{adventureOtto.level}
        <StyledExp>50/100 EXP</StyledExp>
      </StyledLevel>
      <StyledTitle>No Explorer Title</StyledTitle>
      <AdventureProgressBar progress={10} />
      <StyedAttrs>
        {otto.displayAttrs.map(attr => (
          <StyledAttr key={attr.trait_type}>
            <StyledType>{attr.trait_type.toLocaleUpperCase()}</StyledType>
            <StyledValue>{attr.value}</StyledValue>
          </StyledAttr>
        ))}
      </StyedAttrs>
    </StyledOttoCard>
  )
}
