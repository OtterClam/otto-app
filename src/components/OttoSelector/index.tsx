import CroppedImage from 'components/CroppedImage'
import { useSwipeable } from 'react-swipeable'
import { useOtto } from 'contexts/Otto'
import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
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

const StyledItem = styled.div<{ actived: boolean }>`
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 5px;
  padding: 4px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  transition: background 0.2s;

  ${({ actived, theme }) => `
    background: ${actived ? theme.colors.crownYellow : theme.colors.lightGray400};
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
  ({ otto, actived, onSelect }: { otto: Otto; actived: boolean; onSelect: (otto: Otto) => void }) => {
    return (
      <StyledItem actived={actived} onClick={() => onSelect(otto)}>
        <StyledImage>
          <CroppedImage src={otto.image} draggable="false" width={imageSize} height={imageSize} />
        </StyledImage>
      </StyledItem>
    )
  },
  (propsA, propsB) => propsA.otto.tokenId === propsB.otto.tokenId && propsA.actived === propsB.actived
)

export default function OttoSelector() {
  const { ottos } = useMyOttos()
  const [offsetDelta, setOffsetDelta] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const { otto: selectedOtto, setOtto: selectOtto } = useOtto()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const conveyorRef = useRef<HTMLDivElement | null>(null)
  const containerRect = containerRef.current?.getBoundingClientRect() ?? { left: 0, right: 0, width: 0 }
  const conveyorRect = conveyorRef.current?.getBoundingClientRect() ?? { left: 0, right: 0, width: 0 }
  const centerOffset = (-1 * conveyorRect.width) / 2
  const totalOffset = centerOffset + currentOffset + offsetDelta
  const selectedIndex = ottos.findIndex(otto => otto.tokenId === selectedOtto?.tokenId) ?? 0

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

  useBrowserLayoutEffect(() => {
    const space = (conveyorRect.width - containerRect.width) / 2
    if (space < 0) {
      setCurrentOffset(0)
    }
  }, [ottos])

  return (
    <StyledContainer ref={containerRef}>
      <StyledConveyor {...swipeableHandlers} ref={conveyorRef} offset={totalOffset}>
        <StyledArrow index={selectedIndex} />
        {ottos.map(otto => (
          <OttoItem
            key={otto.tokenId}
            otto={otto}
            actived={selectedOtto?.tokenId === otto.tokenId}
            onSelect={selectOtto}
          />
        ))}
      </StyledConveyor>
    </StyledContainer>
  )
}
