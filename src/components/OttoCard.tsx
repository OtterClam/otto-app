import RankingIcon from 'assets/ranking.png'
import BorderContainer from 'components/BorderContainer'
import Item, { EmptyItem, traitToItem } from 'models/Item'
import Otto from 'models/Otto'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/macro'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'

const StyledOttoCard = styled(BorderContainer)`
  width: 265px;
  height: 448px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.otterBlack};

  padding: 15px;
  gap: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: 363px;
    /* padding: 8px 5px; */
    gap: 8px;
    align-items: center;
  }

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => theme.colors.lightGray100};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`

const StyledOttoImage = styled.img`
  width: 225px;
  height: 225px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;

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
    background-image: url(${RankingIcon});
    background-size: 100%;
  }
`

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 80px);
  column-gap: 10px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledDiffAttr = styled.span`
  color: ${({ theme }) => theme.colors.clamPink};
`

interface Props {
  className?: string
  otto: Otto
  oldOtto?: Otto
  item?: Item
  takeOff?: boolean
}

export default function OttoCard({ otto, oldOtto, item, takeOff = false, className }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const diffAttrs = useMemo(() => {
    const diff: Record<string, string> = {}
    if (oldOtto) {
      otto.metadata.otto_attrs.forEach(({ trait_type, value }) => {
        const oldAttr = oldOtto.metadata.otto_attrs.find(({ trait_type: t }) => t === trait_type)
        const diffValue = Number(value) - Number(oldAttr?.value ?? 0)
        diff[trait_type] = String(diffValue > 0 ? `+${diffValue}` : diffValue)
      })
    }
    if (item) {
      const originTrait = otto.wearableTraits.find(p => p.type === item?.type || '')
      let originItem = takeOff ? item : originTrait ? traitToItem(originTrait) : EmptyItem
      if (takeOff) {
        originItem = item
        item = EmptyItem
      }
      item.stats.forEach(({ name, value: strValue }) => {
        const oldValue = Number(originItem.stats.find(({ name: n }) => n === name)?.value || 0)
        const value = Number(strValue) - oldValue
        diff[name] = String(value < 0 ? '-' : '+') + Math.abs(value)
      })
      const rarityScore = item.total_rarity_score - originItem.total_rarity_score
      diff.rarityScore = String((rarityScore < 0 ? '-' : '+') + Math.abs(rarityScore))
    }
    return diff
  }, [otto, oldOtto, item])
  return (
    <StyledOttoCard borderColor={theme.colors.lightGray400} className={className}>
      <StyledOttoImage src={otto.largeImage} />
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
