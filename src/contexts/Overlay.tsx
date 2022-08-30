import styled from 'styled-components/macro'
import { IS_SERVER } from 'constant'
import noop from 'lodash/noop'
import { CSSTransition } from 'react-transition-group'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from 'react'
import { createPortal } from 'react-dom'

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: var(--z-index-overlay);

  &.fade-enter {
    transform-origin: top center;
    opacity: 0.1;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity 0.2s;
  }

  &.fade-exit {
    transform-origin: top center;
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.1;
    transition: opacity 0.2s;
  }
`

enum ActionType {
  Increase,
  Decrease,
}

const OverlayContext = createContext<{ counter: number; dispatch: (action: { type: ActionType }) => void }>({
  counter: 0,
  dispatch: noop,
})

export const OverlayProvider = ({ children }: PropsWithChildren<object>) => {
  const [counter, dispatch] = useReducer((state: number, action: { type: ActionType }) => {
    switch (action.type) {
      case ActionType.Decrease:
        return Math.max(state - 1, 0)
      case ActionType.Increase:
        return state + 1
      default:
        return state
    }
  }, 0)

  const value = useMemo(
    () => ({
      counter,
      dispatch,
    }),
    [counter]
  )

  if (IS_SERVER) {
    return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  }

  return (
    <OverlayContext.Provider value={value}>
      {children}
      {createPortal((
        <CSSTransition unmountOnExit in={Boolean(counter)} timeout={200} classNames="fade">
          <StyledOverlay />
        </CSSTransition>
      ), document.body.querySelector('#modal-root')!)}
    </OverlayContext.Provider>
  )
}

export const useOverlay = (show: boolean) => {
  const { dispatch } = useContext(OverlayContext)

  useEffect(() => {
    if (show) {
      dispatch({ type: ActionType.Increase })
      return () => dispatch({ type: ActionType.Decrease })
    }
  }, [show])
}
