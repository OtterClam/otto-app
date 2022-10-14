import AdventureProgressBar from 'components/AdventureProgressBar'
import CroppedImage from 'components/CroppedImage'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, Note } from 'styles/typography'

const StyledOttoCard = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  position: relative;
  z-index: 0;
  padding: 10px;
  color: ${({ theme }) => theme.colors.otterBlack};

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    z-index: -2;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.otterBlack};
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.lightGray400};
  }

  &::after {
    position: absolute;
    top: 3px;
    right: 3px;
    bottom: 3px;
    left: 3px;
    content: '';
    z-index: -1;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.colors.otterBlack};
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.white};
  }
`

const StyledImage = styled.div`
  position: relative;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const StyledName = styled(ContentExtraSmall)``

const StyledExpContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledExp = styled.div``

const StyledLevel = styled(Caption)`
  display: flex;
  justify-content: space-between;
`

const StyledTitle = styled(Note)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyedAttrs = styled(Note)`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  column-gap: 20px;
  max-width: 104px;
`

const StyledAttr = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 5px;
`

const StyledType = styled.div``

const StyledValue = styled.div`
  display: flex;
  gap: 2px;
`

const StyledDiff = styled.span`
  color: ${({ theme }) => theme.colors.seaweedGreen};
`

const StyledAdventureProgressBar = styled(AdventureProgressBar)`
  background: ${({ theme }) => theme.colors.lightGray300};
  height: 10px;
`

export interface OttoCardProps {
  otto: Otto
  points?: { [k: string]: number }
  className?: string
}

export default function OttoCard({ otto, className, points = {} }: OttoCardProps) {
  return (
    <StyledOttoCard className={className}>
      <StyledImage>
        <CroppedImage src={otto.image} layout="fill" />
      </StyledImage>
      <StyledName>{otto.name}</StyledName>
      <StyledExpContainer>
        <StyledLevel>
          LV.{otto.level}
          <StyledExp>
            {otto.exp}/{otto.next_level_exp} EXP
          </StyledExp>
        </StyledLevel>
        <StyledTitle>{otto.adventurerTitle}</StyledTitle>
        <StyledAdventureProgressBar progress={otto.exp / otto.next_level_exp} />
      </StyledExpContainer>
      <StyedAttrs>
        {otto.displayAttrs.map(attr => (
          <StyledAttr key={attr.trait_type}>
            <StyledType>{attr.trait_type.toLocaleUpperCase()}</StyledType>
            <StyledValue>
              {attr.value}
              {(points[attr.trait_type.toLocaleLowerCase()] ?? 0) > 0 && (
                <StyledDiff>(+{points[attr.trait_type.toLocaleLowerCase()]})</StyledDiff>
              )}
            </StyledValue>
          </StyledAttr>
        ))}
      </StyedAttrs>
    </StyledOttoCard>
  )
}
