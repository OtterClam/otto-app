import AdventureProgressBar from 'components/AdventureProgressBar'
import CroppedImage from 'components/CroppedImage'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'

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

const StyledDiff = styled.span``

export interface OttoCardProps {
  otto: Otto
  points?: { [k: string]: number }
}

export default function OttoCard({ otto, points = {} }: OttoCardProps) {
  return (
    <StyledOttoCard>
      <StyledImage>
        <CroppedImage src={otto.image} layout="fill" />
      </StyledImage>
      <StyledName>{otto.name}</StyledName>
      <StyledLevel>
        LV.{otto.level}
        <StyledExp>
          {otto.exp}/{otto.next_level_exp} EXP
        </StyledExp>
      </StyledLevel>
      <StyledTitle>{otto.adventurerTitle}</StyledTitle>
      <AdventureProgressBar progress={otto.exp / otto.next_level_exp} />
      <StyedAttrs>
        {otto.displayAttrs.map(attr => (
          <StyledAttr key={attr.trait_type}>
            <StyledType>{attr.trait_type.toLocaleUpperCase()}</StyledType>
            <StyledValue>
              {attr.value}
              {(points[attr.trait_type] ?? 0) > 0 && <StyledDiff>(+{points[attr.trait_type]})</StyledDiff>}
            </StyledValue>
          </StyledAttr>
        ))}
      </StyedAttrs>
    </StyledOttoCard>
  )
}
