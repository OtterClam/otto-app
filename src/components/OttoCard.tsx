// TODO: stop using trait data in components
import RankingIcon from 'assets/ranking.png'
import BorderContainer from 'components/BorderContainer'
import { defaultStats, Item, ItemStatName } from 'models/Item'
import Otto from 'models/Otto'
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import styled, { useTheme } from 'styled-components/macro'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'
import { useIsMyOttos } from 'MyOttosProvider'
import OttoImage from './OttoImage'

const StyledOttoCard = styled(BorderContainer)`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.otterBlack};

  padding: 15px;
  gap: 12px;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    gap: 8px;
  }

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => theme.colors.lightGray100};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`

const StyledOttoImage = styled(OttoImage).attrs({ size: 225 })`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
    height: unset;
  }
`

const StyledOttoName = styled.h2`
  text-align: center;
`

const StyledOttoRarity = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledRarityScore = styled(ContentSmall).attrs({ as: 'p' })``

const StyledRanking = styled(ContentSmall).attrs({
  as: 'div',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${RankingIcon.src});
    background-size: 100%;
  }
`

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 80px);
  column-gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    grid-template-columns: 1fr 1fr;
  }
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledDiffAttr = styled.span`
  color: ${({ theme }) => theme.colors.clamPink};
`

// TODO: extract rarity score calculation logic
interface Props {
  className?: string
  otto: Otto
  oldOtto?: Otto
  withItem?: Item
  takeOff?: boolean
}

export default function OttoCard({ otto, oldOtto, withItem: item, takeOff = false, className }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMyOtto = useIsMyOttos(otto.id)

  const diffAttrs = useMemo(() => {
    const diff: Record<string, string> = {}

    if (oldOtto) {
      otto.raw.otto_attrs.forEach(({ trait_type, value }) => {
        const oldAttr = oldOtto.raw.otto_attrs.find(({ trait_type: t }) => t === trait_type)
        const diffValue = Number(value) - Number(oldAttr?.value ?? 0)
        diff[trait_type] = String(diffValue > 0 ? `+${diffValue}` : diffValue)
      })
      return diff
    }

    if (takeOff && item) {
      const nativeTrait = otto.ottoNativeTraits.find(({ type }) => type === item.metadata.type)
      const originalTrait = otto.wearableTraits.find(p => p.type === item.metadata.type)
      const defaultStatsList = Object.entries(defaultStats).map(([name, value]) => ({ name, value }))

      if (!nativeTrait) {
        ;(originalTrait?.stats ?? defaultStatsList).forEach(({ name, value }) => {
          const newDiffValue = Number(value) - Number(item.metadata.stats[name as ItemStatName])
          diff[name] = String(newDiffValue > 0 ? `+${newDiffValue}` : newDiffValue)
        })
        const rarityScore = (originalTrait?.total_rarity_score ?? 0) - item.metadata.totalRarityScore
        diff.rarityScore = String(rarityScore > 0 ? `+${rarityScore}` : rarityScore)
        return diff
      }

      ;(nativeTrait?.stats ?? defaultStatsList).forEach(({ name, value }) => {
        const newDiffValue =
          Number(value) - Number(originalTrait?.stats?.find(stat => stat.name === name)?.value ?? '0')
        diff[name] = String(newDiffValue > 0 ? `+${newDiffValue}` : newDiffValue)
      })
      const rarityScore = (nativeTrait?.total_rarity_score ?? 0) - (originalTrait?.total_rarity_score ?? 0)
      diff.rarityScore = String(rarityScore > 0 ? `+${rarityScore}` : rarityScore)
      return diff
    }

    if (item) {
      const originalTrait = otto.wearableTraits.find(p => p.type === item.metadata.type)
      const defaultStatsList = Object.entries(defaultStats).map(([name, value]) => ({ name, value }))

      ;(originalTrait?.stats ?? defaultStatsList).forEach(({ name, value }) => {
        const newDiffValue = Number(item.metadata.stats[name as ItemStatName]) - Number(value)
        diff[name] = String(newDiffValue > 0 ? `+${newDiffValue}` : newDiffValue)
      })
      const rarityScore = item.metadata.totalRarityScore - (originalTrait?.total_rarity_score ?? 0)
      diff.rarityScore = String(rarityScore > 0 ? `+${rarityScore}` : rarityScore)
      return diff
    }

    return diff
  }, [otto, oldOtto, item])

  return (
    <StyledOttoCard borderColor={theme.colors.lightGray400} className={className}>
      <StyledOttoImage unoptimized={isMyOtto} src={otto.image} />
      <StyledOttoName>
        <ContentMedium>{otto.name}</ContentMedium>
      </StyledOttoName>
      <StyledOttoRarity>
        <StyledRarityScore>
          {t('my_ottos.rarity_score', { score: otto.totalRarityScore })}
          {diffAttrs.rarityScore && <StyledDiffAttr>({diffAttrs.rarityScore})</StyledDiffAttr>}
        </StyledRarityScore>
        <StyledRanking>{`#${otto.ranking}`}</StyledRanking>
      </StyledOttoRarity>
      <StyledAttrs>
        <StyledAttr>
          <Caption>Level</Caption>
          <Caption>{otto.level}</Caption>
        </StyledAttr>
        {otto.displayAttrs.map(({ trait_type, value }, index) => (
          <StyledAttr key={index}>
            <Caption>{trait_type}</Caption>
            <Caption>
              {value}
              {diffAttrs[trait_type] && <StyledDiffAttr>({diffAttrs[trait_type]})</StyledDiffAttr>}
            </Caption>
          </StyledAttr>
        ))}
      </StyledAttrs>
    </StyledOttoCard>
  )
}
