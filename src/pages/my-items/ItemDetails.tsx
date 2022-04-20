import { t } from 'i18next'
import Item from 'models/Item'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Headline, Note } from 'styles/typography'

const StyledItemDetails = styled.section`
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 10px;
`

const StyledItemImageContainer = styled.div<{ rarity: string }>`
  width: 320px;
  height: 320px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

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

const StyledDesc = styled.div``

interface Props {
  item: Item
}

export default function ItemDetails({ item: { name, image, rarity, type, description } }: Props) {
  return (
    <StyledItemDetails>
      <StyledItemImageContainer rarity={rarity}>
        <StyledItemImage src={image} />
        <StyledRarity rarity={rarity}>
          <Note>{rarity}</Note>
        </StyledRarity>
      </StyledItemImageContainer>
      <StyledTag type={type}>
        <Caption>{t(`my_items.section_title.${type}`)}</Caption>
      </StyledTag>
      <StyledTitleContainer>
        <Headline>{name}</Headline>
        <StyledRarityLabel rarity={rarity}>
          <ContentSmall>{rarity}</ContentSmall>
        </StyledRarityLabel>
      </StyledTitleContainer>
      <StyledDesc>
        <ContentSmall>{description}</ContentSmall>
      </StyledDesc>
    </StyledItemDetails>
  )
}
