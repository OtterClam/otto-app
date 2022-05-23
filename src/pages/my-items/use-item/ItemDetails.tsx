import CloseButton from 'components/CloseButton'
import Button from 'components/Button'
import Item from 'models/Item'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Headline, Note } from 'styles/typography'
import GenderSpecific from 'components/GenderSpecific'
import { useTranslation } from 'react-i18next'

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

interface Props {
  item: Item
  onClose?: () => void
  onUse?: (item: Item) => void
  className?: string
}

export default function ItemDetails({ item, onClose, onUse, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { id, name, image, rarity, type, description, equippable_gender } = item
  console.log(`item id: ${id}`)
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
        <Headline>{name}</Headline>
        <StyledRarityLabel rarity={rarity}>
          <ContentSmall>{rarity}</ContentSmall>
        </StyledRarityLabel>
      </StyledTitleContainer>
      <GenderSpecific equippableGender={equippable_gender} />
      <StyledDesc>{description}</StyledDesc>
      <StyledRarityScore>
        {t('total_rarity_score', {
          total: item.baseRarityScore + item.relativeRarityScore,
          brs: item.baseRarityScore,
          rrs: item.relativeRarityScore,
        })}
      </StyledRarityScore>
      <StyledWearCount>{t('wear_count', { count: item.equippedCount })}</StyledWearCount>
      <StyledAttrs>
        {item.stats.map(({ name, value }, i) => (
          <StyledAttr key={i}>
            <ContentSmall>{name}</ContentSmall>
            <ContentSmall>{value}</ContentSmall>
          </StyledAttr>
        ))}
      </StyledAttrs>
      {onUse && (
        <StyledButton onClick={() => onUse(item)}>
          <Headline>{item.wearable ? (item.equipped ? t('take_off') : t('wear')) : t('use')}</Headline>
        </StyledButton>
      )}
    </StyledItemDetails>
  )
}
