import Button from 'components/Button'
import OttoCard from 'components/OttoCard'
import { t } from 'i18next'
import Item from 'models/Item'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import ItemDetails from './ItemDetails'
import OttoList from './OttoList'

const StyledUseItemView = styled.div`
  display: flex;
`

const StyledItemDetails = styled(ItemDetails)`
  flex: 4;
  background: ${({ theme }) => theme.colors.lightGray100};
  border-right: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledOttoPicker = styled.section`
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

export default function UseItemView({ item, selectedOtto, onSelect, onUse }: Props) {
  return (
    <StyledUseItemView>
      <StyledItemDetails item={item} />
      <StyledOttoPicker>
        <StyledPickerTitle>
          <Headline>{t('my_items.use_item.title')}</Headline>
        </StyledPickerTitle>
        <OttoList itemId={item.id} selectedOtto={selectedOtto} onSelect={onSelect} />
        {selectedOtto && <StyledOttoCard otto={selectedOtto} />}
        <StyledUseButton onClick={onUse}>
          <Headline>{t('my_items.use')}</Headline>
        </StyledUseButton>
      </StyledOttoPicker>
    </StyledUseItemView>
  )
}
