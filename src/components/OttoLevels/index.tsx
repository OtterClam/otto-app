import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 1px;
`

const StyledLevel = styled(Note)<{ traitType: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  &::before {
    content: attr(data-label);
    background: ${({ theme, traitType }) => theme.colors.attr[traitType]};
  }
`

export interface OttoLevelsProps {
  otto?: Otto
}

export default function OttoLevels({ otto }: OttoLevelsProps) {
  return (
    <StyledContainer>
      {otto?.displayAttrs?.map(trait => (
        <StyledLevel key={trait.trait_type} traitType={trait.trait_type} data-label={trait.trait_type}>
          {trait.value}
        </StyledLevel>
      ))}
    </StyledContainer>
  )
}
