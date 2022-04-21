import Item from 'models/Item'
import styled from 'styled-components'
import { Caption } from 'styles/typography'
import ItemCell from '../ItemCell'

const StyledItemPreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.lightGray200};
`

const StyledItemCell = styled(ItemCell)``

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 40px);
  column-gap: 10px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  title: string
  item: Item
}

export default function ItemPreviewCard({ title, item }: Props) {
  return (
    <StyledItemPreviewCard>
      <Caption>{title}</Caption>
      <StyledItemCell item={item} />
      <StyledAttrs>
        {item.attrs.map(({ type, value }, i) => (
          <StyledAttr key={i}>
            <Caption>{type}</Caption>
            <Caption>{value}</Caption>
          </StyledAttr>
        ))}
      </StyledAttrs>
    </StyledItemPreviewCard>
  )
}
