import AdventureAlert from 'components/AdventureAlert'
import Fullscreen from 'components/Fullscreen'
import { AdventurePopupStep, AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import usePrevious from 'hooks/usePrevious'
import { useTranslation } from 'next-i18next'
import { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components/macro'
import { useAdventureLocations } from 'contexts/AdventureLocations'
import { useMyOttos } from 'MyOttosProvider'
import { AdventureOttoStatus } from 'models/Otto'
import ExploringStep from './ExploringStep'
import { LocationInfoStep } from './LocationInfoStep'
import MapStep from './MapStep'
import PreviewOttoStep from './PreviewOttoStep'
import ReadyToGoStep from './ReadyToGoStep'
import RestingStep from './RestingStep'
import ResultStep from './ResultStep'
import arrowImage from './arrow.svg'

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

const StyledFullscreen = styled(Fullscreen)<{ maxWidth: number }>`
  border-radius: 10px !important;
  max-width: ${({ maxWidth }) => maxWidth}px !important;
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

const StyledNextLocationButton = styled.button`
  position: relative;
  z-index: 1;
  min-width: 44px;
  max-width: 44px;
  height: 44px;
  background: center / cover url(${arrowImage.src});
  margin-left: -22px;
`

const StyledPrevLocationButton = styled(StyledNextLocationButton)`
  transform: rotateZ(180deg);
  margin-right: -22px;
`

const stepOrder = [
  AdventurePopupStep.Map,
  AdventurePopupStep.LocationInfo,
  AdventurePopupStep.PreviewOtto,
  AdventurePopupStep.ReadyToGo,
  AdventurePopupStep.Exploring,
  AdventurePopupStep.Result,
  AdventurePopupStep.Resting,
]

const Components = {
  [AdventurePopupStep.Map]: MapStep,
  [AdventurePopupStep.LocationInfo]: LocationInfoStep,
  [AdventurePopupStep.PreviewOtto]: PreviewOttoStep,
  [AdventurePopupStep.ReadyToGo]: ReadyToGoStep,
  [AdventurePopupStep.Exploring]: ExploringStep,
  [AdventurePopupStep.Result]: ResultStep,
  [AdventurePopupStep.Resting]: RestingStep,
}

export default function AdventurePopup() {
  const { locations } = useAdventureLocations()
  const { ottos } = useMyOttos()
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup' })
  const [closePopupRequested, setClosePopupRequested] = useState(false)
  const { state: adventureUIState, dispatch } = useAdventureUIState()
  const { itemActions } = useOtto()
  const prevStep = usePrevious(adventureUIState.popupStep)
  const maxWidth = adventureUIState.popupStep === AdventurePopupStep.Map ? 600 : 880

  const closePopup = useCallback(() => {
    setClosePopupRequested(false)
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  const requestClosePopup = useCallback(() => {
    if (itemActions.length) {
      setClosePopupRequested(true)
    } else {
      closePopup()
    }
  }, [itemActions])

  const nextLocation: MouseEventHandler = e => {
    e.stopPropagation()
    const maxLevel = Math.max(
      0,
      ...ottos.filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready).map(otto => otto.level)
    )
    const avaliableLocations = locations.filter(loc => maxLevel >= loc.minLevel)
    const index = avaliableLocations.findIndex(loc => loc.id === adventureUIState.selectedLocationId)
    const nextIndex = avaliableLocations.length <= index + 1 ? 0 : index + 1
    dispatch({ type: AdventureUIActionType.SelectLocation, data: { locationId: avaliableLocations[nextIndex].id } })
  }

  const prevLocation: MouseEventHandler = e => {
    e.stopPropagation()
    const maxLevel = Math.max(
      0,
      ...ottos.filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready).map(otto => otto.level)
    )
    const avaliableLocations = locations.filter(loc => maxLevel >= loc.minLevel)
    const index = avaliableLocations.findIndex(loc => loc.id === adventureUIState.selectedLocationId)
    const nextIndex = index <= 0 ? avaliableLocations.length - 1 : index - 1
    dispatch({ type: AdventureUIActionType.SelectLocation, data: { locationId: avaliableLocations[nextIndex].id } })
  }

  const effects = useMemo(() => {
    const step = adventureUIState.popupStep
    const prevStepIndex = prevStep ? stepOrder.indexOf(prevStep) : -1
    const stepIndex = stepOrder.indexOf(step)

    return stepOrder.reduce((effects, step, index) => {
      if (prevStepIndex === -1) {
        effects[step] = 'right'
        return effects
      }
      if (prevStepIndex > stepIndex) {
        effects[step] = index <= stepIndex ? 'left' : 'right'
        return effects
      }
      effects[step] = index <= stepIndex ? 'right' : 'left'
      return effects
    }, {} as { [k: string]: string })
  }, [adventureUIState.popupStep])

  useBrowserLayoutEffect(() => {
    if (!itemActions.length) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      e.returnValue = t('closeWindowAlert.content')
    }

    window.addEventListener('beforeunload', handler, true)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [itemActions])

  return (
    <StyledFullscreen
      maxWidth={maxWidth}
      bodyClassName="adventurePopupBody"
      show={adventureUIState.popupOpened}
      onRequestClose={requestClosePopup}
      header={
        adventureUIState.popupStep === AdventurePopupStep.LocationInfo ? (
          <StyledPrevLocationButton onClick={prevLocation} />
        ) : undefined
      }
      footer={
        adventureUIState.popupStep === AdventurePopupStep.LocationInfo ? (
          <StyledNextLocationButton onClick={nextLocation} />
        ) : undefined
      }
    >
      <TransitionGroup>
        {stepOrder.map(step => {
          if (step !== adventureUIState.popupStep) {
            return
          }
          const Step = Components[step]
          return (
            <CSSTransition key={step} timeout={200} classNames={effects[step]}>
              <StyledStepContainer>
                <Step />
              </StyledStepContainer>
            </CSSTransition>
          )
        })}
      </TransitionGroup>

      <AdventureAlert
        storageKey="closeAdventurePopup"
        show={closePopupRequested}
        content={t('closePopupAlert.content')}
        okLabel={t('closePopupAlert.okLabel')}
        cancelLabel={t('closePopupAlert.cancelLabel')}
        onOk={closePopup}
        onCancel={() => setClosePopupRequested(false)}
      />
    </StyledFullscreen>
  )
}
