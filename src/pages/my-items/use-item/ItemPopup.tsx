import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import Item from 'models/Item'
import Otto from 'models/Otto'
import { MyOttosContext } from 'MyOttosProvider'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import UseItemView from './UseItemView'
import WearItemView from './WearItemView'
import NutrientAnimation from './NutrientAnimation'
import UseItemComplete from './UseItemComplete'

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
  const [state, setState] = useState(State.Idle)
  const { ottos } = useContext(MyOttosContext)
  const [selectedOtto, setSelectedOtto] = useState<Otto | null>(null)
  useEffect(() => {
    if (ottos.length > 0) {
      setSelectedOtto(ottos[0])
    }
  }, [ottos])

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
            <UseItemComplete otto={selectedOtto} receivedItem={item} onClose={onClose} />
          </StyledCompletedContainer>
        ) : null

      case State.Idle:
      default:
        return (
          <StyledItemPopup>
            {item.wearable ? (
              <UseItemView
                item={item}
                selectedOtto={selectedOtto}
                onSelect={setSelectedOtto}
                onUse={() => {
                  console.log('use')
                }}
              />
            ) : (
              <WearItemView
                item={item}
                selectedOtto={selectedOtto}
                onSelect={setSelectedOtto}
                onUse={() => {
                  console.log('use')
                }}
              />
            )}
            <StyledCloseButton onClose={onClose} />
          </StyledItemPopup>
        )
    }
  }
  return <Fullscreen show>{render()}</Fullscreen>
}
