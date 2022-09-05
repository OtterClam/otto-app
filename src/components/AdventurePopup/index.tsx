import styled from 'styled-components/macro'
import Fullscreen from 'components/Fullscreen'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { OttoProvider } from 'contexts/Otto'
import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useEffect, useState } from 'react'
import { LocationInfoStep } from './LocationInfoStep'
import PreviewOttoStep from './PreviewOttoStep'
import ReadyToGoStep from './ReadyToGoStep'
import ExploringStep from './ExploringStep'
import ResultStep from './ResultStep'

enum Step {
  LocationInfo,
  PreviewOtto,
  ReadyToGo,
  Exploring,
  Result,
}

const StyledStepContainer = styled.div`
  &.fade-enter {
    transform-origin: top center;
    opacity: 0.1;
    transform: scale(0.8);
  }

  &.fade-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: transform 0.2s, opacity 0.2s;
  }

  &.fade-exit {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: top center;
    opacity: 1;
    transform: scale(1);
  }

  &.fade-exit-active {
    opacity: 0.1;
    transform: scale(0.8);
    transition: transform 0.2s, opacity 0.2s;
  }
`

export interface AdventurePopupProps {
  show?: boolean
}

export default function AdventurePopup({ show }: AdventurePopupProps) {
  const [step, setStep] = useState(Step.Result)
  const { ottos } = useMyOttos()

  return (
    <Fullscreen show={show}>
      <TransitionGroup>
        {step === Step.LocationInfo && (
          <CSSTransition key={Step.LocationInfo} timeout={200} classNames="fade">
            <StyledStepContainer>
              <LocationInfoStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {step === Step.PreviewOtto && (
          <CSSTransition key={Step.PreviewOtto} timeout={200} classNames="fade">
            <StyledStepContainer>
              <PreviewOttoStep />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {step === Step.ReadyToGo && ottos[0] && (
          <CSSTransition key={Step.ReadyToGo} timeout={200} classNames="fade">
            <StyledStepContainer>
              <ReadyToGoStep otto={ottos[0]} />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {step === Step.Exploring && ottos[0] && (
          <CSSTransition key={Step.Exploring} timeout={200} classNames="fade">
            <StyledStepContainer>
              <ExploringStep otto={ottos[0]} />
            </StyledStepContainer>
          </CSSTransition>
        )}
        {step === Step.Result && ottos[0] && (
          <CSSTransition key={Step.Result} timeout={200} classNames="fade">
            <StyledStepContainer>
              <ResultStep otto={ottos[0]} />
            </StyledStepContainer>
          </CSSTransition>
        )}
      </TransitionGroup>
    </Fullscreen>
  )
}
