import { Trait } from 'models/Otto'
import styled from 'styled-components/macro'
import { useTranslation } from 'react-i18next'
import { ContentLarge, ContentSmall, Note } from 'styles/typography'
import ItemCell from 'components/ItemCell'
import { useMemo } from 'react'
import { traitToItem } from 'models/Item'
import GenderSpecific from 'components/GenderSpecific'
import UnreturnableHint from 'components/UnreturnableHint'

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

const StyledUnreturnable = styled(Note)`
  color: ${({ theme }) => theme.colors.darkGray100};
`

export interface Props {
  trait: Trait
}

export default function TraitCard({ trait }: Props) {
  const { t } = useTranslation()
  const {
    type,
    name,
    image,
    stats,
    rarity,
    total_rarity_score,
    base_rarity_score,
    relative_rarity_score,
    equippable_gender,
    unreturnable,
    wearable,
  } = trait
  const title = t(`otto.traits.title`, { type: t(`otto.traits.${type}`), name })
  const item = useMemo(() => traitToItem(trait), [trait])
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
        {image && <ItemCell item={item} />}
        <StyledInfoContainer>
          <StyledRarityScore as="p">
            {t('otto.rarity_score', { score: total_rarity_score, brs: base_rarity_score, rrs: relative_rarity_score })}
          </StyledRarityScore>
          <StyledStats>
            {stats.map(({ name, value }, i) => (
              <StyledStat key={i}>
                <Note>{name}</Note>
                <Note>{value}</Note>
              </StyledStat>
            ))}
          </StyledStats>
          <GenderSpecific equippableGender={equippable_gender} />
        </StyledInfoContainer>
      </StyledBottomContainer>
      {wearable && unreturnable && <UnreturnableHint />}
    </StyledTraitCard>
  )
}
