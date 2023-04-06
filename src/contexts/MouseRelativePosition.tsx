import {
  createContext,
  PropsWithChildren,
  Children,
  cloneElement,
  useRef,
  DetailedReactHTMLElement,
  RefObject,
  useState,
  useEffect,
  useContext,
} from 'react'

export interface Position {
  x: number
  y: number
}

const MouseRelativePositionContext = createContext<Position>({ x: 0, y: 0 })

function _useMouseRelativePosition<T extends HTMLElement>(ref: RefObject<T>, center: boolean) {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const target = ref.current

    const eventHandler = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newPos = center
        ? {
            x: x - rect.width / 2,
            y: y - rect.height / 2,
          }
        : { x, y }
      setPos(newPos)
    }

    target.addEventListener('mousemove', eventHandler)

    return () => {
      target.removeEventListener('mousemove', eventHandler)
    }
  }, [ref, center])

  return pos
}

export const MouseRelativePositionProvider = ({ children, center = true }: PropsWithChildren<{ center?: boolean }>) => {
  const ref = useRef() as RefObject<any>
  const pos = _useMouseRelativePosition(ref, center)

  const child = cloneElement(Children.only(children) as DetailedReactHTMLElement<any, HTMLElement>, {
    ref,
  })

  return <MouseRelativePositionContext.Provider value={pos}>{child}</MouseRelativePositionContext.Provider>
}

export const useMouseRelativePosition = () => {
  return useContext(MouseRelativePositionContext)
}
