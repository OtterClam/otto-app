import styled from 'styled-components/macro'
import { useTranslation } from 'next-i18next'
import { Caption, ContentLarge, ContentSmall, Note } from 'styles/typography'
import ItemCell from 'components/ItemCell'
import { ItemMetadata, Item } from 'models/Item'
import GenderSpecific from 'components/GenderSpecific'
import UnreturnableHint from 'components/UnreturnableHint'
import TraitLabels from 'components/TraitLabels'

const StyledTraitCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledTopContainer = styled.div`
  display: flex;
`

const StyledTitle = styled.p<{ icon: string }>`
  display: flex;
  align-items: center;
  flex: 1;

  &:before {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url(${({ icon }) => icon});
    background-size: 30px 30px;
    margin-right: 12px;
  }
`

const StyledRarityBadge = styled.div<{ rarity: string }>`
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
  border-radius: 6px;
  height: fit-content;
`

const StyledBottomContainer = styled.div`
  display: flex;
  gap: 20px;
`

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledRarityScore = styled(ContentSmall)``

const StyledStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 60px);
  grid-column-gap: 10px;
`

const StyledStat = styled.p`
  display: flex;
  justify-content: space-between;
`

const StyledWearCount = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray100};
`

export interface Props {
  metadata?: ItemMetadata
}

export default function ItemCard({ metadata }: Props) {
  if (!metadata) {
    throw new Error('missing required prop')
  }

  const { t } = useTranslation()

  const item: Item = {
    id: '',
    amount: 1,
    unreturnable: false,
    metadata,
    updatedAt: new Date(),
  }
  const {
    type,
    name,
    image,
    stats,
    rarity,
    totalRarityScore,
    baseRarityScore,
    relativeRarityScore,
    equippedCount,
    equippableGender,
    unreturnable,
    wearable,
  } = metadata

  const title = t(`otto.traits.title`, { type: t(`otto.traits.${type}`), name })

  return (
    <StyledTraitCard>
      <StyledTopContainer>
        <StyledTitle icon={encodeURI(`/trait-icons/${type}.png`)}>
          <ContentLarge>{title}</ContentLarge>
        </StyledTitle>
        <StyledRarityBadge rarity={rarity}>
          <ContentSmall>{t(`otto.rarity.${rarity}`)}</ContentSmall>
        </StyledRarityBadge>
      </StyledTopContainer>
      <StyledBottomContainer>
        {image && (
          <div>
            <ItemCell showDetailsPopup={item.metadata.wearable} item={item} />
          </div>
        )}
        <StyledInfoContainer>
          <StyledRarityScore as="p">
            {t('otto.rarity_score', { score: totalRarityScore, brs: baseRarityScore, rrs: relativeRarityScore })}
          </StyledRarityScore>
          <TraitLabels highlightMatched metadata={metadata} />
          <StyledWearCount>{t('otto.trait_count', { count: equippedCount })}</StyledWearCount>
          <StyledStats>
            {Object.entries(stats).map(([key, val]) => (
              <StyledStat key={key}>
                <Note>{key}</Note>
                <Note>{val}</Note>
              </StyledStat>
            ))}
          </StyledStats>
          <GenderSpecific equippableGender={equippableGender} />
        </StyledInfoContainer>
      </StyledBottomContainer>
      {wearable && unreturnable && <UnreturnableHint />}
    </StyledTraitCard>
  )
}
