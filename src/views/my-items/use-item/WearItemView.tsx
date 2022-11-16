import LegendaryIcon from 'assets/badge/legendary.png'
import Arrow from 'assets/ui/arrow-right-yellow.svg'
import Button from 'components/Button'
import OttoCard from 'components/OttoCard'
import { Item } from 'models/Item'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Headline, Note } from 'styles/typography'
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

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: center;
  }
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
  const originItemMetadata = selectedOtto?.wearableItemsMetadata.find(({ type }) => type === item.metadata.type)

  return (
    <StyledWearItemView>
      <StyledPickerTitle>
        <Headline>{t('my_items.wear_item.title')}</Headline>
      </StyledPickerTitle>
      <OttoList itemId={item.metadata.tokenId} selectedOtto={selectedOtto} onSelect={onSelect} />
      <StyledBottomContainer>
        {selectedOtto && <StyledOttoCard otto={selectedOtto} withItem={item} />}
        <StyledOttoPreviewContainer>
          <StyledItemPreview>
            <ItemPreviewCard title={t('my_items.wear_item.current_equipped')} metadata={originItemMetadata} />
            <img width={30} src={Arrow.src} alt="arrow" />
            <ItemPreviewCard title={t('my_items.wear_item.replaced')} metadata={item.metadata} />
          </StyledItemPreview>
          {selectedOtto?.legendary && (
            <StyledLegendaryWarning>
              <img src={LegendaryIcon} alt="Legendary Icon" />
              {t('my_items.legendary_warning')}
            </StyledLegendaryWarning>
          )}
          <StyledUseButton Typography={Headline} onClick={onUse}>
            {t('my_items.wear')}
          </StyledUseButton>
        </StyledOttoPreviewContainer>
      </StyledBottomContainer>
    </StyledWearItemView>
  )
}
