import ReactDOM from 'react-dom'
import { CSSProperties, ReactNode, RefObject, useRef } from 'react'
import styled from 'styled-components/macro'
import useDisableBodyScroll from 'hooks/useDisableBodyScroll'
import noop from 'lodash/noop'
import { CSSTransition } from 'react-transition-group'
import { useOverlay } from 'contexts/Overlay'

const StyledPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  box-sizing: border-box;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-popup);

  &.fade-enter {
    transform-origin: top center;
    opacity: 0.1;
    transform: translateY(50px) scale(0.9);
  }

  &.fade-enter-active {
    opacity: 1;
    transform: translateY(1px) scale(1);
    transition: transform 0.2s, opacity 0.2s;
  }

  &.fade-exit {
    transform-origin: top center;
    opacity: 1;
    transform: translateY(1px) scale(1);
  }

  &.fade-exit-active {
    opacity: 0.1;
    transform: translateY(50px) scale(0.9);
    transition: transform 0.2s, opacity 0.2s;
  }
`

const Container = styled.div<{ width: string }>`
  position: relative;
  width: ${props => props.width};
  max-width: 880px;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.crownYellow};
  box-sizing: border-box;

  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerContainer = styled.div<{ background?: string }>`
  padding: 6px;
  position: relative;
  border-radius: 10px;
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
  className?: string
  popupStyle?: CSSProperties
  bodyClassName?: string
  header?: ReactNode
  footer?: ReactNode
}

const Fullscreen = ({
  show = true,
  background,
  width = '80%',
  onRequestClose = noop,
  className,
  popupStyle,
  bodyClassName,
  children,
  header,
  footer,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>

  useDisableBodyScroll(show)

  useOverlay(show)

  if (typeof document === 'undefined') {
    return null
  }

  return ReactDOM.createPortal(
    <CSSTransition unmountOnExit in={show} timeout={200} classNames="fade">
      <StyledPopup onClick={onRequestClose} style={popupStyle}>
        {header}
        <Container width={width} ref={containerRef} className={className} onClick={e => e.stopPropagation()}>
          <StyledInnerContainer className={bodyClassName} background={background}>
            <Content>{children}</Content>
          </StyledInnerContainer>
        </Container>
        {footer}
      </StyledPopup>
    </CSSTransition>,
    document.querySelector('#modal-root') ?? document.body
  )
}

export default Fullscreen
