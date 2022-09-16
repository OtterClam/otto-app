import { useThemeMatcher } from 'contexts/LeaderboardEpoch'
import { Trait } from 'models/Otto'
import styled from 'styled-components'
import { Note } from 'styles/typography'

const StyledContainer = styled(Note).attrs({ as: 'div' })`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledLabel = styled.span<{ small?: boolean; matched?: boolean; boost?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme, boost }) => (boost ? theme.colors.crownYellow : theme.colors.lightGray200)};
  border-radius: 11px;
  padding: 0 5px;
  height: ${({ small }) => (small ? 18 : 22)}px;
`

export interface TraitLabelsProps {
  trait: Trait
  highlightMatched?: boolean
  small?: boolean
}

export default function TraitLabels({ trait, highlightMatched, small }: TraitLabelsProps) {
  const matchTheme = useThemeMatcher()
  const boost = trait.theme_boost ?? 1
  const labels = trait.labels ?? []

  return (
    <StyledContainer>
      {labels.map(label => (
        <StyledLabel small={small} matched={highlightMatched && matchTheme(label)} key={label}>
          {label}
        </StyledLabel>
      ))}
      <StyledLabel key="__themeBoost" boost>
        {boost} 🔥
      </StyledLabel>
    </StyledContainer>
  )
}
