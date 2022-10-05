import styled from 'styled-components/macro'
import Fullscreen from 'components/Fullscreen'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useOtto } from 'contexts/Otto'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { useCallback } from 'react'
import { LocationInfoStep } from './LocationInfoStep'
import PreviewOttoStep from './PreviewOttoStep'
import ReadyToGoStep from './ReadyToGoStep'
import ExploringStep from './ExploringStep'

export enum Step {
  LocationInfo,
  PreviewOtto,
  ReadyToGo,
  Exploring,
  Result,
}

const StyledStepContainer = styled.div`
  &.left-enter {
    transform: translateX(-100%);
  }

  &.left-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: transform 0.2s;
  }

  &.left-exit {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translateX(0);
  }

  &.left-exit-active {
    transform: translateX(100%);
    transition: transform 0.2s;
  }

  &.right-enter {
    transform: translateX(100%);
  }

  &.right-enter-active {
    transform: translateX(0);
    transition: transform 0.2s;
  }

  &.right-exit {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    transform: translateX(0);
  }

  &.right-exit-active {
    transform: translateX(-100%);
    transition: transform 0.2s;
  }
`

const StyledFullscreen = styled(Fullscreen)`
  border-radius: 10px !important;
  max-width: 800px;
  border-width: 2px !important;
  border-color: ${({ theme }) => theme.colors.crownYellow} !important;
  background-color: ${({ theme }) => theme.colors.otterBlack} !important;
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.otterBlack},
    -1px 1px 1px ${({ theme }) => theme.colors.otterBlack}, 1px -1px 1px ${({ theme }) => theme.colors.otterBlack},
    -1px -1px 1px ${({ theme }) => theme.colors.otterBlack};

  .adventurePopupBody {
    border-radius: 6px !important;
    margin: 1.5px;
    padding: 0;
    overflow: hidden;
  }
`

export default function AdventurePopup() {
  const { state: adventureUIState, dispatch } = useAdventureUIState()
  const { otto } = useOtto()

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  return (
    <StyledFullscreen
      bodyClassName="adventurePopupBody"
      show={adventureUIState.popupOpened}
      onRequestClose={closePopup}
    >
      <TransitionGroup>
        {adventureUIState.popupStep === Step.LocationInfo && (
          <CSSTransition key={Step.LocationInfo} timeout={200} classNames="left">
            <StyledStepContainer>
              <LocationInfoStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {adventureUIState.popupStep === Step.PreviewOtto && (
          <CSSTransition key={Step.PreviewOtto} timeout={200} classNames="right">
            <StyledStepContainer>
              <PreviewOttoStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {adventureUIState.popupStep === Step.ReadyToGo && otto && (
          <CSSTransition key={Step.ReadyToGo} timeout={200} classNames="right">
            <StyledStepContainer>
              <ReadyToGoStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {adventureUIState.popupStep === Step.Exploring && otto && (
          <CSSTransition key={Step.Exploring} timeout={200} classNames="right">
            <StyledStepContainer>
              <ExploringStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
      </TransitionGroup>
    </StyledFullscreen>
  )
}
