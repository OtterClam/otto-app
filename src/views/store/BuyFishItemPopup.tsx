import Fullscreen from 'components/Fullscreen'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { OttoTransactionWriteState } from 'contracts/functions'
import { Item } from 'models/Item'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import NutrientAnimation from 'views/my-items/use-item/NutrientAnimation'

const StyledProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledProcessingText = styled(ContentLarge).attrs({ as: 'p' })`
  text-align: center;
  white-space: pre;
  color: ${({ theme }) => theme.colors.white};
`

function Forging() {
  const { t } = useTranslation('', { keyPrefix: 'store.popup' })
  return (
    <Fullscreen show>
      <StyledProcessingContainer>
        <NutrientAnimation />
        <StyledProcessingText>{t('processing')}</StyledProcessingText>
      </StyledProcessingContainer>
    </Fullscreen>
  )
}

interface Props {
  state: OttoTransactionWriteState
  item: Item
  onClose: () => void
}

export default function BuyFishItemPopup({ state, item, onClose }: Props) {
  if (state.state === 'None') {
    return null
  }
  if (state.state === 'Success') {
    return <OpenItemView items={[item.metadata]} onClose={onClose} />
  }
  return <Forging />
}
