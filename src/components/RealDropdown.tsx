import { IS_SERVER } from 'constant'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import useOnClickOutside from 'hooks/useOnClickOutside'
import {
  cloneElement,
  isValidElement,
  ReactChild,
  ReactElement,
  RefObject,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'

const StyledContainer = styled.div<{ pos: { x: number; y: number } }>`
  position: fixed;
  z-index: var(--z-index-dropdown);
  left: ${({ pos }) => pos.x}px;
  top: ${({ pos }) => pos.y}px;

  &.slide-enter {
    transform-origin: top center;
    opacity: 0.3;
    transform: scaleY(0);
  }

  &.slide-enter-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 0.2s, opacity 0.2s;
  }

  &.slide-exit {
    transform-origin: top center;
    opacity: 1;
    transform: scaleY(1);
  }

  &.slide-exit-active {
    opacity: 0.3;
    opacity: 0;
    transition: transform 0.2s, opacity 0.2s;
  }
`

export enum DropdownPostion {
  TopLeft,
  TopRight,
}

export interface RealDropdownProps {
  position?: DropdownPostion
  children: ReactElement
  content: (close: () => void) => ReactChild
  className?: string
}

export default function RealDropdown({
  className,
  children,
  content,
  position = DropdownPostion.TopLeft,
}: RealDropdownProps) {
  const [forceUpdateState, forceUpdate] = useReducer((state: number) => state + 1, 0)
  const [show, setShow] = useState(false)
  const childRef = useRef<HTMLElement>()
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>

  const pos = useMemo(() => {
    if (!childRef.current || !containerRef.current) {
      return { x: 0, y: 0 }
    }
    const rect = childRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    return {
      x: position === DropdownPostion.TopLeft ? rect.left : rect.left + rect.width - containerRect.width,
      y: rect.top,
    }
  }, [childRef.current, forceUpdateState, show, position])

  useOnClickOutside(containerRef, () => {
    setShow(false)
  })

  useBrowserLayoutEffect(() => {
    forceUpdate()
  }, [show])

  if (IS_SERVER || !isValidElement(children)) {
    return children
  }

  const child = cloneElement(children as ReactElement, {
    ref: childRef,
    onClick: (e: MouseEvent) => {
      e.stopPropagation()
      setShow(true)
    },
  })

  return (
    <>
      {child}
      {createPortal(
        <CSSTransition unmountOnExit in={show} timeout={200} classNames="slide">
          <StyledContainer ref={containerRef} className={className} pos={pos}>
            {content(() => setShow(false))}
          </StyledContainer>
        </CSSTransition>,
        document.querySelector('#modal-root')!
      )}
    </>
  )
}
