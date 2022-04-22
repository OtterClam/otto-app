import CloseButton from 'components/CloseButton'
import OttoCard from 'components/OttoCard'
import Otto from 'models/Otto'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Arrow from 'assets/ui/arrow-right-yellow.svg'
import Button from 'components/Button'
import Item from 'models/Item'
import ItemCell from '../ItemCell'
import Ribbon from './ribbon.svg'
import Star from './star.svg'

const StyledUseItemComplete = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  padding: 35px;
  gap: 20px;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 35px;
  right: 35px;
`

const StyledTitle = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
`

const StyledOttoResult = styled.section`
  display: flex;
  gap: 20px;
`

const StyledOttoCard = styled(OttoCard)`
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledArrow = styled.img``

const StyledReceivedItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledReceivedItemText = styled.div`
  text-align: center;
  width: 223px;
  height: 53px;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon});
  padding-top: 6px;
`

const StyledReceivedItemContainer = styled.div`
  position: relative;
`

const StyledReceivedItemCell = styled(ItemCell)``

const StyledItemCellBg = styled.img`
  position: absolute;
  top: -25%;
  left: -26%;
`

const CloseButtonLarge = styled(Button)``

interface Props {
  otto: Otto
  newOtto: Otto
  receivedItem?: Item
  onClose: () => void
}

export default function UseItemComplete({ otto, newOtto, receivedItem, onClose }: Props) {
  const { t } = useTranslation()
  return (
    <StyledUseItemComplete>
      <StyledCloseButton color="white" onClose={onClose} />
      <StyledTitle>
        <Headline>{t('my_items.use_item.completed_title')}</Headline>
        <ContentSmall>{t('my_items.use_item.completed_subtitle')}</ContentSmall>
      </StyledTitle>
      <StyledOttoResult>
        <StyledOttoCard otto={otto} />
        <StyledArrow src={Arrow} />
        <StyledOttoCard otto={newOtto} />
      </StyledOttoResult>
      {receivedItem && (
        <StyledReceivedItem>
          <StyledReceivedItemText>
            <ContentSmall>{t('my_items.use_item.receive_item')}</ContentSmall>
          </StyledReceivedItemText>
          <StyledReceivedItemContainer>
            <StyledItemCellBg src={Star} />
            <StyledReceivedItemCell item={receivedItem} />
          </StyledReceivedItemContainer>
        </StyledReceivedItem>
      )}
      <CloseButtonLarge primaryColor="white" onClick={onClose}>
        <Headline>{t('close')}</Headline>
      </CloseButtonLarge>
    </StyledUseItemComplete>
  )
}
