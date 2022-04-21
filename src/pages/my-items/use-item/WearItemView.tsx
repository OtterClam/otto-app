import Button from 'components/Button'
import OttoCard from 'components/OttoCard'
import { t } from 'i18next'
import Item from 'models/Item'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import Arrow from 'assets/ui/arrow-right-yellow.svg'
import { useTranslation } from 'react-i18next'
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

interface Props {
  item: Item
  selectedOtto: Otto | null
  onSelect: (otto: Otto) => void
  onUse: () => void
}

export default function WearItemView({ item, selectedOtto, onSelect, onUse }: Props) {
  const { t } = useTranslation()
  return (
    <StyledWearItemView>
      <StyledPickerTitle>
        <Headline>{t('my_items.wear_item.title')}</Headline>
      </StyledPickerTitle>
      <OttoList selectedOtto={selectedOtto} onSelect={onSelect} />
      <StyledBottomContainer>
        {selectedOtto && <StyledOttoCard otto={selectedOtto} item={item} />}
        <StyledOttoPreviewContainer>
          <StyledItemPreview>
            <ItemPreviewCard title={t('my_items.wear_item.current_equipped')} item={item} />
            <img width={30} src={Arrow} alt="arrow" />
            <ItemPreviewCard title={t('my_items.wear_item.replaced')} item={item} />
          </StyledItemPreview>
          <StyledUseButton onClick={onUse}>
            <Headline>{t('my_items.use')}</Headline>
          </StyledUseButton>
        </StyledOttoPreviewContainer>
      </StyledBottomContainer>
    </StyledWearItemView>
  )
}
