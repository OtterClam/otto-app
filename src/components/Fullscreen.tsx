import ReactDOM from 'react-dom'
import { ReactNode, RefObject, useRef } from 'react'
import styled from 'styled-components/macro'
import useDisableBodyScroll from 'hooks/useDisableBodyScroll'
import noop from 'lodash/noop'
import { CSSTransition } from 'react-transition-group'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { useOverlay } from 'contexts/Overlay'

const StyledPopup = styled.div`
  position: fixed;
  top: env(safe-area-inset-top);
  right: env(safe-area-inset-right);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-popup);

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

const Container = styled.div<{ width: string }>`
  position: relative;
  width: ${props => props.width};
  background-color: ${({ theme }) => theme.colors.crownYellow};
  padding: 6px;
  box-sizing: border-box;
  max-width: 880px;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerContainer = styled.div<{ background?: string }>`
  position: relative;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.otterBlack};

  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ background }) => background || 'transparent'};
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  show?: boolean
  background?: string
  width?: string
  children: ReactNode
  onRequestClose?: () => void
  bodyClassName?: string
}

const Fullscreen = ({
  show = true,
  background,
  width = '80%',
  onRequestClose = noop,
  bodyClassName,
  children,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>

  useDisableBodyScroll(show)

  useOverlay(show)

  useOnClickOutside(containerRef, onRequestClose)

  if (typeof document === 'undefined') {
    return null
  }

  return ReactDOM.createPortal(
    <CSSTransition unmountOnExit in={show} timeout={200} classNames="fade">
      <StyledPopup>
        <Container width={width} ref={containerRef}>
          <StyledInnerContainer className={bodyClassName} background={background}>
            <Content>{children}</Content>
          </StyledInnerContainer>
        </Container>
      </StyledPopup>
    </CSSTransition>,
    document.querySelector('#modal-root') ?? document.body
  )
}

export default Fullscreen
