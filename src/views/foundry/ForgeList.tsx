import { ForgeFormula } from 'models/Forge'
import styled from 'styled-components/macro'
import ForgeItem from './ForgeItem'
import { MyItemAmounts } from './type'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 60px 74px 74px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    padding: 15px;
  }
`

export interface ForgeListProps {
  formulas: ForgeFormula[]
  itemAmounts: MyItemAmounts
  refetchMyItems: () => void
}

export default function ForgeList({ formulas, itemAmounts: itemCounts, refetchMyItems }: ForgeListProps) {
  return (
    <StyledContainer>
      {formulas.map(formula => (
        <ForgeItem key={formula.id} formula={formula} itemAmounts={itemCounts} refetchMyItems={refetchMyItems} />
      ))}
    </StyledContainer>
  )
}
