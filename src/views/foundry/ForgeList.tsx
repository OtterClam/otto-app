import { Forge } from 'models/Forge'
import styled from 'styled-components/macro'
import ForgeItem from './ForgeItem'

const StyledContainer = styled.div`
  padding: 60px 74px 74px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    padding: 15px;
  }
`

export interface ForgeListProps {
  forges: Forge[]
}

export default function ForgeList({ forges }: ForgeListProps) {
  return (
    <StyledContainer>
      {forges.map(forge => (
        <ForgeItem key={forge.id} forge={forge} />
      ))}
    </StyledContainer>
  )
}
