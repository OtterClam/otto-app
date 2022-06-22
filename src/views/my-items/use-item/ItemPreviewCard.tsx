import Item, { EmptyItem } from 'models/Item'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Caption } from 'styles/typography'
import ItemCell from 'components/ItemCell'
import UnreturnableHint from 'components/UnreturnableHint'

const StyledItemPreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.lightGray200};
  gap: 10px;
  align-items: center;
`

const StyledItemCell = styled(ItemCell)`
  flex: none;
`

const StyledRarityScore = styled.p``

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50px);
  column-gap: 10px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  title: string
  item?: Item
}

export default function ItemPreviewCard({ title, item = EmptyItem }: Props) {
  const { t } = useTranslation()
  return (
    <StyledItemPreviewCard>
      <Caption>{title}</Caption>
      <StyledItemCell item={item} />
      <StyledRarityScore>
        <Caption>{t('my_items.rarity_score', { score: item.total_rarity_score })}</Caption>
      </StyledRarityScore>
      <StyledAttrs>
        {item.stats.map(({ name, value }, i) => (
          <StyledAttr key={i}>
            <Caption>{name}</Caption>
            <Caption>{value}</Caption>
          </StyledAttr>
        ))}
      </StyledAttrs>
      {item.unreturnable && <UnreturnableHint />}
    </StyledItemPreviewCard>
  )
}
