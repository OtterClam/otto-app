import { TraitRarity } from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'

const StyledContainer = styled(Caption)<{ rarity: TraitRarity }>`
  display: inline-flex;
  background: ${({ theme, rarity }) => theme.colors.rarity[rarity]};
  height: 21px;
  padding: 0 10px;
  align-items: center;
  border-radius: 6px;
`

export interface ItemRarityBadgeProps {
  rarity: TraitRarity
}

export default function ItemRarityBadge({ rarity }: ItemRarityBadgeProps) {
  const { t } = useTranslation('', { keyPrefix: 'otto.rarity' })
  return <StyledContainer rarity={rarity}>{t(rarity)}</StyledContainer>
}
