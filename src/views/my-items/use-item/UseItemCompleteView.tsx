import CloseButton from 'components/CloseButton'
import OttoCard from 'components/OttoCard'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Arrow from 'assets/ui/arrow-right-yellow.svg'
import Button from 'components/Button'
import Item from 'models/Item'
import useOtto from 'hooks/useOtto'
import { useEffect, useState } from 'react'
import Ribbon from 'assets/ui/ribbon.svg'
import ItemCell from 'components/ItemCell'
import Star from 'assets/ui/star.svg'

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
  background-image: url(${Ribbon.src});
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
  otto: Otto | null
  receivedItem?: Item
  onClose: () => void
}

export default function UseItemCompleteView({ otto, receivedItem, onClose }: Props) {
  const { t } = useTranslation()
  const [newOttoReady, setNewOttoReady] = useState(false)
  const { otto: newOtto, refetch } = useOtto(otto?.raw, true)
  useEffect(() => {
    if (newOtto?.image === otto?.image) {
      setTimeout(() => refetch(), 5000)
    } else {
      setNewOttoReady(true)
    }
  }, [newOtto, otto])
  return (
    <StyledUseItemComplete>
      <StyledCloseButton color="white" onClose={onClose} />
      <StyledTitle>
        <Headline>{t('my_items.use_item.completed_title')}</Headline>
        <ContentSmall>{t('my_items.use_item.completed_subtitle')}</ContentSmall>
      </StyledTitle>
      <StyledOttoResult>
        {otto && <StyledOttoCard otto={otto} />}
        <StyledArrow src={Arrow.src} />
        {newOttoReady && newOtto && <StyledOttoCard otto={newOtto} />}
      </StyledOttoResult>
      {receivedItem && (
        <StyledReceivedItem>
          <StyledReceivedItemText>
            <ContentSmall>{t('my_items.use_item.receive_item')}</ContentSmall>
          </StyledReceivedItemText>
          <StyledReceivedItemContainer>
            <StyledItemCellBg src={Star.src} />
            <StyledReceivedItemCell item={receivedItem} />
          </StyledReceivedItemContainer>
        </StyledReceivedItem>
      )}
      <CloseButtonLarge primaryColor="white" Typography={Headline} onClick={onClose}>
        {t('close')}
      </CloseButtonLarge>
    </StyledUseItemComplete>
  )
}
