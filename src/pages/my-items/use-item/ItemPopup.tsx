import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import { takeOffItem, useItem } from 'contracts/functions'
import useOtto from 'hooks/useOtto'
import Item from 'models/Item'
import Otto from 'models/Otto'
import { MyOttosContext } from 'MyOttosProvider'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import NutrientAnimation from './NutrientAnimation'
import TakeOffItemView from './TakeOffItemView'
import UseItemComplete from './UseItemComplete'
import UseItemView from './UseItemView'
import WearItemView from './WearItemView'

const StyledItemPopup = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`

const StyledProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledCompletedContainer = styled.div`
  height: 90vh;
  overflow-y: scroll;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.otterBlack};
`

const StyledLoadingAnimation = styled(NutrientAnimation)``

const StyledProcessingText = styled.div`
  text-align: center;
  white-space: pre;
  color: ${({ theme }) => theme.colors.white};
`

enum State {
  Idle,
  Using,
  Complete,
}

interface Props {
  item: Item
  onClose: () => void
}

export default function ItemPopup({ item, onClose }: Props) {
  const { t } = useTranslation()
  const { useItemState, use, resetUse } = useItem()
  const { takeOffState, takeOff, resetTakeOff } = takeOffItem()
  const [state, setState] = useState(State.Idle)
  const { ottos } = useContext(MyOttosContext)
  const [selectedOtto, setSelectedOtto] = useState<Otto | null>(null)

  const onUse = () => {
    use(item.id, selectedOtto?.tokenId || '')
  }
  const onTakeOff = () => {
    takeOff(item.id, item.parentTokenId || '')
  }
  useEffect(() => {
    if (ottos.length > 0) {
      setSelectedOtto(ottos[0])
    }
  }, [ottos])
  useEffect(() => {
    if (useItemState.status === 'Mining' || takeOffState.status === 'Mining') {
      setState(State.Using)
    }
    if (useItemState.status === 'Success' || takeOffState.status === 'Success') {
      setState(State.Complete)
      resetUse()
      resetTakeOff()
    }
    if (
      useItemState.status === 'Fail' ||
      useItemState.status === 'Exception' ||
      takeOffState.status === 'Fail' ||
      takeOffState.status === 'Exception'
    ) {
      alert(useItemState.errorMessage || '')
      setState(State.Idle)
      resetUse()
      resetTakeOff()
    }
  }, [useItemState, takeOffState])

  const render = () => {
    switch (state) {
      case State.Using:
        return (
          <StyledProcessingContainer>
            <StyledLoadingAnimation />
            <StyledProcessingText>
              <ContentLarge>{t('my_items.use_item.processing')}</ContentLarge>
            </StyledProcessingText>
          </StyledProcessingContainer>
        )
      case State.Complete:
        return selectedOtto ? (
          <StyledCompletedContainer>
            <UseItemComplete otto={selectedOtto} newOtto={selectedOtto} receivedItem={item} onClose={onClose} />
          </StyledCompletedContainer>
        ) : null
      case State.Idle:
      default:
        return (
          <StyledItemPopup>
            {item.wearable ? (
              item.equipped ? (
                <TakeOffItemView
                  item={item}
                  otto={ottos.find(p => p.tokenId === item.parentTokenId)!}
                  onUse={onTakeOff}
                />
              ) : (
                <WearItemView item={item} selectedOtto={selectedOtto} onSelect={setSelectedOtto} onUse={onUse} />
              )
            ) : (
              <UseItemView item={item} selectedOtto={selectedOtto} onSelect={setSelectedOtto} onUse={onUse} />
            )}
            <StyledCloseButton onClose={onClose} />
          </StyledItemPopup>
        )
    }
  }
  return <Fullscreen show>{render()}</Fullscreen>
}
