import useResizeObserver from '@react-hook/resize-observer'
import CroppedImage from 'components/CroppedImage'
import { useOtto } from 'contexts/Otto'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import styled from 'styled-components/macro'
import arrowImage from './arrow.svg'

const imageSize = 50

const StyledContainer = styled.div`
  height: 70px;
`

const StyledConveyor = styled.div<{ offset: number }>`
  position: absolute;
  left: 50%;
  display: flex;
  flex-wrap: no-wrap;
  gap: 8px;
  transform: ${({ offset }) => `translate(${offset}px)`};
  user-select: none;
`

const StyledArrow = styled.img.attrs({ src: arrowImage.src })<{ index: number }>`
  position: absolute;
  left: 0;
  bottom: -10px;
  transform: translateX(${({ index }) => index * 68 - 10 + 30}px);
  transition: transform 0.2s;
  width: 20px;
  height: 8px;
`

const StyledItem = styled.div<{ activated: boolean }>`
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 5px;
  padding: 4px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  transition: background 0.2s;

  ${({ activated, theme }) => `
    background: ${activated ? theme.colors.crownYellow : theme.colors.lightGray400};
  `}
`

const StyledImage = styled.div`
  display: flex;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  box-sizing: border-box;
  width: ${imageSize}px;
  height: ${imageSize}px;
`

const OttoItem = React.memo(
  ({ otto, activated, onSelect }: { otto: Otto; activated: boolean; onSelect: (otto: Otto) => void }) => {
    return (
      <StyledItem activated={activated} onClick={() => onSelect(otto)}>
        <StyledImage>
          <CroppedImage src={otto.image} draggable="false" width={imageSize} height={imageSize} />
        </StyledImage>
      </StyledItem>
    )
  },
  (propsA, propsB) => propsA.otto.id === propsB.otto.id && propsA.activated === propsB.activated
)

const useReadyOttos = () => {
  const { ottos } = useMyOttos()
  const map = ottos
    .filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready)
    .reduce((map, otto) => Object.assign(map, { [otto.id]: true }), {} as { [k: string]: boolean })
  return ottos.filter(otto => map[otto.id])
}

export default function OttoSelector() {
  const [forceUpdateState, forceUpdate] = useReducer(state => state + 1, 0)
  const ottos = useReadyOttos()
  const [offsetDelta, setOffsetDelta] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const { otto: selectedOtto, setOtto: selectOtto } = useOtto()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const conveyorRef = useRef<HTMLDivElement | null>(null)
  const containerRect = containerRef.current?.getBoundingClientRect() ?? { left: 0, right: 0, width: 0 }
  const conveyorRect = conveyorRef.current?.getBoundingClientRect() ?? { left: 0, right: 0, width: 0 }
  const centerOffset = (-1 * conveyorRect.width) / 2
  const totalOffset = centerOffset + currentOffset + offsetDelta
  const selectedIndex = ottos.findIndex(otto => otto.id === selectedOtto?.id) ?? 0

  const swipeableHandlers = useSwipeable({
    trackMouse: true,
    preventScrollOnSwipe: true,
    onSwiped: () => {
      setCurrentOffset(currentOffset + offsetDelta)
      setOffsetDelta(0)
    },
    onSwiping: event => {
      const space = (conveyorRect.width - containerRect.width) / 2
      if (space < 0) {
        return
      }

      setOffsetDelta(Math.max(-1 * space, Math.min(space, event.deltaX + currentOffset)) - currentOffset)
    },
  })

  const updateOffset = () => {
    const space = (conveyorRect.width - containerRect.width) / 2
    if (space < 0) {
      setCurrentOffset(0)
    }
  }

  useResizeObserver(containerRef, forceUpdate)

  useResizeObserver(conveyorRef, forceUpdate)

  useLayoutEffect(updateOffset, [forceUpdateState])

  useEffect(() => {
    if (!selectedOtto && ottos.length > 0) {
      selectOtto(ottos[0])
    }
  }, [selectedOtto, ottos])

  return (
    <StyledContainer ref={containerRef}>
      <StyledConveyor {...swipeableHandlers} ref={conveyorRef} offset={totalOffset}>
        <StyledArrow index={selectedIndex} />
        {ottos.map(otto => (
          <OttoItem key={otto.id} otto={otto} activated={selectedOtto?.id === otto.id} onSelect={selectOtto} />
        ))}
      </StyledConveyor>
    </StyledContainer>
  )
}
