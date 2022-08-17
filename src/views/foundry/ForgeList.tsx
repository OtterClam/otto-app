import { Forge } from 'models/Forge'
import Item from 'models/Item'
import styled from 'styled-components/macro'
import ForgeItem from './ForgeItem'
import { MyItemAmounts } from './type'

const StyledContainer = styled.div`
  padding: 60px 74px 74px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    padding: 15px;
  }
`

export interface ForgeListProps {
  forges: Forge[]
  itemAmounts: MyItemAmounts
  refetchMyItems: () => void
}

export default function ForgeList({ forges, itemAmounts: itemCounts, refetchMyItems }: ForgeListProps) {
  return (
    <StyledContainer>
      {forges.map(forge => (
        <ForgeItem key={forge.id} forge={forge} itemAmounts={itemCounts} refetchMyItems={refetchMyItems} />
      ))}
    </StyledContainer>
  )
}
