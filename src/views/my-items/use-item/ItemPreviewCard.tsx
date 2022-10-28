import { defaultStats, ItemMetadata } from 'models/Item'
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
  metadata?: ItemMetadata
}

export default function ItemPreviewCard({ title, metadata }: Props) {
  const { t } = useTranslation()
  return (
    <StyledItemPreviewCard>
      <Caption>{title}</Caption>
      <StyledItemCell metadata={metadata} />
      <StyledRarityScore>
        <Caption>{t('my_items.rarity_score', { score: metadata?.totalRarityScore ?? 0 })}</Caption>
      </StyledRarityScore>
      <StyledAttrs>
        {Object.entries(metadata?.stats ?? defaultStats).map(([key, val]) => (
          <StyledAttr key={key}>
            <Caption>{key}</Caption>
            <Caption>{val}</Caption>
          </StyledAttr>
        ))}
      </StyledAttrs>
      {metadata?.unreturnable && <UnreturnableHint />}
    </StyledItemPreviewCard>
  )
}
