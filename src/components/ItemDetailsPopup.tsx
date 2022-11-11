import styled from 'styled-components/macro'
import ItemCell from 'components/ItemCell'
import { useRepositories } from 'contexts/Repositories'
import { ItemMetadata, ItemType } from 'models/Item'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideItemDetailsPopup, selectItemDetailsPopup } from 'store/uiSlice'
import { Caption, Headline, ContentSmall } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import Skeleton from 'react-loading-skeleton'
import ItemCollectionBadge from 'components/ItemCollectionBadge'
import GenderSpecific from 'components/GenderSpecific'
import TraitLabels from 'components/TraitLabels'
import AdventureFullscreen from './AdventureFullscreen'
import SkeletonThemeProvider, { SkeletonColor } from './SkeletonThemeProvider'

const StyledTag = styled.div<{ type?: string }>`
  display: flex;
  align-items: center;
  padding: 7px;
  background: ${({ theme }) => theme.colors.lightGray200};
  width: fit-content;
  height: 32px;
  border-radius: 16px;

  ${({ type }) =>
    type &&
    `
    &::before {
      content: '';
      display: inline-block;
      width: 21px;
      height: 21px;
      background-size: 21px 21px;
      background-image: url(/trait-icons/${encodeURIComponent(type)}.png);
      margin-right: 5px;
    }
  `}
`

const StyledTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledName = styled(Headline)`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledRarityLabel = styled.div<{ rarity: string }>`
  display: flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
  padding: 0 10px;
  border-radius: 6px;
`

const StyledWearCount = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray100};
`

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 90px);
  column-gap: 12px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledFullscreen = styled(AdventureFullscreen)`
  width: 360px;
  background: ${({ theme }) => theme.colors.white} !important;
`

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 20px 20px;
  gap: 10px;
`

const StyledItemCell = styled(ItemCell).attrs({ size: 320 })`
  width: 100%;
`

export default function ItemDetailsPopup() {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { items: itemsRepo } = useRepositories()
  const itemTokenId = useSelector(selectItemDetailsPopup)
  const [itemMetadata, setItemMetadata] = useState<ItemMetadata>()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const close = useCallback(() => {
    dispatch(hideItemDetailsPopup())
  }, [])

  useEffect(() => {
    if (!itemTokenId) {
      return
    }

    const controller = new AbortController()

    setLoading(true)
    itemsRepo
      .getMetadata([itemTokenId])
      .then(map => setItemMetadata(map[itemTokenId]))
      .finally(() => setLoading(false))

    return () => {
      controller.abort()
    }
  }, [itemTokenId, itemsRepo])

  return (
    <StyledFullscreen show={Boolean(itemTokenId)} onRequestClose={close}>
      <StyledContainer>
        {(loading || !itemMetadata) && (
          <SkeletonThemeProvider color={SkeletonColor.Light}>
            <StyledItemCell />
            <Skeleton width="250px" count={5} />
          </SkeletonThemeProvider>
        )}
        {!loading && itemMetadata && (
          <>
            <StyledItemCell metadata={itemMetadata} />
            <StyledTag type={itemMetadata.type}>
              <Caption>{t(`section_title.${itemMetadata.type}`)}</Caption>
            </StyledTag>
            <StyledTitleContainer>
              <StyledName>
                {itemMetadata.collection && itemMetadata.collectionName && (
                  <ItemCollectionBadge
                    collection={itemMetadata.collection}
                    collectionName={itemMetadata.collectionName}
                  />
                )}
                {itemMetadata.name}
              </StyledName>
              <StyledRarityLabel rarity={itemMetadata.rarity}>
                <ContentSmall>{itemMetadata.rarity}</ContentSmall>
              </StyledRarityLabel>
            </StyledTitleContainer>
            <GenderSpecific equippableGender={itemMetadata.equippableGender} />
            <ContentSmall as="p">{itemMetadata.description}</ContentSmall>
            {itemMetadata.wearable && (
              <>
                <ContentSmall as="p">
                  {t('total_rarity_score', {
                    total: itemMetadata.totalRarityScore,
                    brs: itemMetadata.baseRarityScore,
                    rrs: itemMetadata.relativeRarityScore,
                  })}
                </ContentSmall>
                <StyledWearCount>{t('wear_count', { count: itemMetadata.equippedCount })}</StyledWearCount>
              </>
            )}
            {!(itemMetadata.type === 'Coupon' || itemMetadata.type === 'Mission Item') && (
              <StyledAttrs>
                {Object.entries(itemMetadata.stats).map(([key, val]) => (
                  <StyledAttr key={key}>
                    <ContentSmall>{key}</ContentSmall>
                    <ContentSmall>{val}</ContentSmall>
                  </StyledAttr>
                ))}
              </StyledAttrs>
            )}
            {itemMetadata.themeBoost > 0 && <TraitLabels metadata={itemMetadata} large highlightMatched />}
          </>
        )}
      </StyledContainer>
    </StyledFullscreen>
  )
}
