import AdventureProgressBar from 'components/AdventureProgressBar'
import BoostIcon from 'components/BoostIcon'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'

const StyledExp = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  height: 42px;
  align-items: stretch;
  overflow: hidden;
`

const StyledLevel = styled(ContentExtraSmall)`
  display: flex;
  align-items: center;
  flex: 0 fit-content;
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.darkGray400};
  font-family: 'PaytoneOne';
`

const StyledLevelDetails = styled.div`
  flex: 1;
  display: grid;
  grid-template-areas:
    'title progress'
    '. .'
    'bar bar'
    '. .';
  grid-template-rows: 70% auto 4px auto;
  grid-template-columns: 1fr fit-content(100%);
  margin: 5px 10px;
`

const StyledExplorerTitle = styled(Note)`
  grid-area: title;
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledLevelUpProgress = styled(Note)`
  grid-area: progress;
  display: flex;
  align-items: center;
`

const StyledLevelUpProgressBar = styled.div`
  grid-area: bar;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.darkGray400};

  &::before {
    display: block;
    border-radius: 2px;
    height: 4px;
    content: '';
    background: linear-gradient(270deg, #9cfe9f 0%, #9ce0ff 50%, #ffada9 100%);
  }
`

export interface OttoAdventureLevelProps {
  otto: Otto
  boost?: boolean
}

export default function OttoAdventureLevel({ otto, boost }: OttoAdventureLevelProps) {
  return (
    <StyledExp>
      <StyledLevel>LV. {otto.level}</StyledLevel>
      <StyledLevelDetails>
        <StyledExplorerTitle>
          {otto.adventurerTitle} {boost && <BoostIcon />}
        </StyledExplorerTitle>
        <StyledLevelUpProgress>
          {otto.exp}/{otto.next_level_exp} EXP
        </StyledLevelUpProgress>
        <AdventureProgressBar progress={otto.exp / otto.next_level_exp} />
      </StyledLevelDetails>
    </StyledExp>
  )
}
