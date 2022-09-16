import { useThemeMatcher } from 'contexts/LeaderboardEpoch'
import { Trait } from 'models/Otto'
import styled from 'styled-components'
import { Note } from 'styles/typography'

const StyledContainer = styled(Note).attrs({ as: 'div' })`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledLabel = styled.span<{ large?: boolean; matched?: boolean; boost?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme, boost }) => (boost ? theme.colors.crownYellow : theme.colors.lightGray200)};
  border-radius: ${({ large }) => (large ? 16 : 11)}px;
  padding: 0 ${({ large }) => (large ? 10 : 5)}px;
  height: ${({ large }) => (large ? 28 : 22)}px;
`

export interface TraitLabelsProps {
  trait: Trait
  highlightMatched?: boolean
  large?: boolean
}

export default function TraitLabels({ trait, highlightMatched, large }: TraitLabelsProps) {
  const matchTheme = useThemeMatcher()
  const labels = trait.labels ?? []

  return (
    <StyledContainer>
      {labels.map(label => (
        <StyledLabel large={large} matched={highlightMatched && matchTheme(label)} key={label}>
          {label}
        </StyledLabel>
      ))}
    </StyledContainer>
  )
}
