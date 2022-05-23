import Button from 'components/Button'
import OttoCard from 'components/OttoCard'
import { t } from 'i18next'
import Item, { EmptyItem, traitToItem } from 'models/Item'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Headline, Note } from 'styles/typography'
import Arrow from 'assets/ui/arrow-right-yellow.svg'
import { useTranslation } from 'react-i18next'
import LegendaryIcon from 'assets/badge/legendary.png'
import ItemPreviewCard from './ItemPreviewCard'
import OttoList from './OttoList'

const StyledWearItemView = styled.div`
  padding: 20px;
  flex: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    padding-top: 60px;
  }
`

const StyledBottomContainer = styled.div`
  display: flex;
  gap: 40px;
`

const StyledOttoPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`

const StyledItemPreview = styled.div`
  display: flex;
  gap: 10px;
`

const StyledOttoCard = styled(OttoCard)`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 70%;
  }
`

const StyledUseButton = styled(Button)`
  width: 60%;
`

const StyledPickerTitle = styled.section``

const StyledLegendaryWarning = styled(Note).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 20px;
  background: ${({ theme }) => theme.colors.crownYellow};
  border-radius: 15px;

  img {
    width: 40px;
    height: 40px;
  }
`

interface Props {
  item: Item
  selectedOtto: Otto | null
  onSelect: (otto: Otto) => void
  onUse: () => void
}

export default function WearItemView({ item, selectedOtto, onSelect, onUse }: Props) {
  const { t } = useTranslation()
  const originTrait = selectedOtto?.wearableTraits.find(p => p.type === item.type)
  const originItem = originTrait ? traitToItem(originTrait) : EmptyItem
  return (
    <StyledWearItemView>
      <StyledPickerTitle>
        <Headline>{t('my_items.wear_item.title')}</Headline>
      </StyledPickerTitle>
      <OttoList itemId={item.id} selectedOtto={selectedOtto} onSelect={onSelect} />
      <StyledBottomContainer>
        {selectedOtto && <StyledOttoCard otto={selectedOtto} item={item} />}
        <StyledOttoPreviewContainer>
          <StyledItemPreview>
            <ItemPreviewCard title={t('my_items.wear_item.current_equipped')} item={originItem} />
            <img width={30} src={Arrow} alt="arrow" />
            <ItemPreviewCard title={t('my_items.wear_item.replaced')} item={item} />
          </StyledItemPreview>
          {selectedOtto?.legendary && (
            <StyledLegendaryWarning>
              <img src={LegendaryIcon} alt="Legendary Icon" />
              {t('my_items.legendary_warning')}
            </StyledLegendaryWarning>
          )}
          <StyledUseButton onClick={onUse}>
            <Headline>{t('my_items.wear')}</Headline>
          </StyledUseButton>
        </StyledOttoPreviewContainer>
      </StyledBottomContainer>
    </StyledWearItemView>
  )
}
