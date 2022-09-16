import CloseButton from 'components/CloseButton'
import Button from 'components/Button'
import Item from 'models/Item'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Headline, Note } from 'styles/typography'
import GenderSpecific from 'components/GenderSpecific'
import { useTranslation } from 'next-i18next'
import ItemCollectionBadge from 'components/ItemCollectionBadge'
import TraitLabels from 'components/TraitLabels'

const StyledItemDetails = styled.section`
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    border-radius: 10px;
  }
`

const StyledCloseButton = styled(CloseButton)`
  display: none;
  position: relative;
  left: calc(100% - 44px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: block;
    right: 0;
  }
`

const StyledItemImageContainer = styled.div<{ rarity: string }>`
  width: 320px;
  height: 320px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: auto;
  }

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
    border-radius: 3px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    pointer-events: none;
  }
`

const StyledItemImage = styled.img`
  width: 100%;
`

const StyledRarity = styled.div<{ rarity: string }>`
  z-index: 10;
  position: absolute;
  top: 3px;
  right: 3px;
  padding-left: 3px;
  background-color: ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
  border-left: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-bottom: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 1px;
`

const StyledTag = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  padding: 7px;
  background: ${({ theme }) => theme.colors.lightGray200};
  width: fit-content;
  height: 32px;
  border-radius: 16px;

  &::before {
    content: '';
    display: inline-block;
    width: 21px;
    height: 21px;
    background-size: 21px 21px;
    background-image: url(/trait-icons/${({ type }) => encodeURI(type)}.png);
    margin-right: 5px;
  }
`

const StyledTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })``

const StyledRarityScore = styled(ContentSmall).attrs({ as: 'p' })``

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

const StyledButton = styled(Button)`
  width: 100%;
  height: 100%;
`

const StyledName = styled(Headline)`
  display: flex;
  align-items: center;
  gap: 5px;
`

interface Props {
  item: Item
  onClose?: () => void
  onUse?: (item: Item) => void
  className?: string
}

export default function ItemDetails({ item, onClose, onUse, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { collection, collection_name, name, image, rarity, type, description, equippable_gender, wearable } = item

  return (
    <StyledItemDetails className={className}>
      {onClose && <StyledCloseButton onClose={onClose} />}
      <StyledItemImageContainer rarity={rarity}>
        <StyledItemImage src={image} />
        <StyledRarity rarity={rarity}>
          <Note>{rarity}</Note>
        </StyledRarity>
      </StyledItemImageContainer>
      <StyledTag type={type}>
        <Caption>{t(`section_title.${type}`)}</Caption>
      </StyledTag>
      <StyledTitleContainer>
        <StyledName>
          {collection && collection_name && (
            <ItemCollectionBadge collection={collection} collectionName={collection_name} />
          )}
          {name}
        </StyledName>
        <StyledRarityLabel rarity={rarity}>
          <ContentSmall>{rarity}</ContentSmall>
        </StyledRarityLabel>
      </StyledTitleContainer>
      <GenderSpecific equippableGender={equippable_gender} />
      <StyledDesc>{description}</StyledDesc>
      {wearable && (
        <>
          <StyledRarityScore>
            {t('total_rarity_score', {
              total: item.base_rarity_score + item.relative_rarity_score,
              brs: item.base_rarity_score,
              rrs: item.relative_rarity_score,
            })}
          </StyledRarityScore>
          <StyledWearCount>{t('wear_count', { count: item.equipped_count })}</StyledWearCount>
        </>
      )}
      {!item.isCoupon && (
        <StyledAttrs>
          {item.stats.map(({ name, value }, i) => (
            <StyledAttr key={i}>
              <ContentSmall>{name}</ContentSmall>
              <ContentSmall>{value}</ContentSmall>
            </StyledAttr>
          ))}
        </StyledAttrs>
      )}
      {/* the following typing issue has been solved in adventure branch */}
      {item.theme_boost > 0 && <TraitLabels trait={item as any} large highlightMatched />}
      {onUse && (
        <StyledButton Typography={Headline} onClick={() => onUse(item)}>
          {item.wearable ? (item.equipped ? t('take_off') : t('wear')) : item.isCoupon ? t('open') : t('use')}
        </StyledButton>
      )}
    </StyledItemDetails>
  )
}
