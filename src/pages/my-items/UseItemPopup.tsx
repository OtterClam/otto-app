import Fullscreen from 'components/Fullscreen'
import Item from 'models/Item'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import ItemDetails from './ItemDetails'

const StyledUseItemPopup = styled.div`
  display: flex;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledItemDetails = styled(ItemDetails)`
  flex: 4;
  background: ${({ theme }) => theme.colors.lightGray100};
  border-right: 2px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledOttoPicker = styled.section`
  flex: 6;
  background: ${({ theme }) => theme.colors.white};
`

const StyledPickerTitle = styled.h1``

interface Props {
  item: Item
}

export default function UseItemPopup({ item }: Props) {
  const { t } = useTranslation()
  return (
    <Fullscreen show>
      <StyledUseItemPopup>
        <StyledItemDetails item={item} />
        <StyledOttoPicker>
          <StyledPickerTitle>
            <Headline>{t('my_items.use_item.title')}</Headline>
          </StyledPickerTitle>
        </StyledOttoPicker>
      </StyledUseItemPopup>
    </Fullscreen>
  )
}
