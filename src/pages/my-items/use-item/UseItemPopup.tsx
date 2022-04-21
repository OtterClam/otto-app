import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import OttoCard from 'components/OttoCard'
import Item from 'models/Item'
import Otto from 'models/Otto'
import { MyOttosContext } from 'MyOttosProvider'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'
import ItemDetails from '../ItemDetails'
import UseItemComplete from './UseItemComplete'
import NutrientAnimation from './NutrientAnimation'

const StyledUseItemPopup = styled.div`
  display: flex;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
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

const StyledPickerTitle = styled.h1``

const StyledOttoList = styled.div`
  display: flex;
  gap: 8px;
`

const StyledOttoCell = styled.button<{ selected: boolean }>`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme, selected }) => (selected ? theme.colors.crownYellow : theme.colors.lightGray400)};
    border-radius: 3px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    pointer-events: none;
  }
`

const StyledOttoImage = styled.img`
  width: 50px;
`

const StyledOttoCard = styled(OttoCard)`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 70%;
  }
`

const StyledUseButton = styled(Button)`
  width: 60%;
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

export default function UseItemPopup({ item, onClose }: Props) {
  const { t } = useTranslation()
  const [state, setState] = useState(State.Complete)
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
          <StyledUseItemPopup>
            <StyledItemDetails item={item} />
            <StyledOttoPicker>
              <StyledPickerTitle>
                <Headline>{t('my_items.use_item.title')}</Headline>
              </StyledPickerTitle>
              <StyledOttoList>
                {ottos.map((o, index) => (
                  <StyledOttoCell key={index} selected={selectedOtto === o} onClick={() => setSelectedOtto(o)}>
                    <StyledOttoImage src={o.image} />
                  </StyledOttoCell>
                ))}
              </StyledOttoList>
              {selectedOtto && <StyledOttoCard otto={selectedOtto} />}
              <StyledUseButton>
                <Headline>{t('my_items.use')}</Headline>
              </StyledUseButton>
            </StyledOttoPicker>
            <StyledCloseButton onClose={onClose} />
          </StyledUseItemPopup>
        )
    }
  }
  return <Fullscreen show>{render()}</Fullscreen>
}
