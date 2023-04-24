import { useBreakpoints } from 'contexts/Breakpoints'
import { Position, useMouseRelativePosition } from 'contexts/MouseRelativePosition'
import useSize from 'hooks/useSize'
import { RefObject, useCallback, useMemo, useRef } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { pins, Pin } from './pins'

const mapImage = {
  src: '/images/map/city_center.jpg',
  width: 8000,
  height: 5040,
}

const cloudLeftImage = {
  src: '/images/map/cloud_left.png',
  width: 1992,
  height: 4800,
}

const cloudRightImage = {
  src: '/images/map/cloud_right.png',
  width: 2502,
  height: 4800,
}

const mapImageDay = {
  src: '/images/map/city_center2_smaller.jpg',
  width: 8000,
  height: 5040,
}

const cloudLeftImageDay = {
  src: '/images/map/cloud_left2.png',
  width: 1992,
  height: 4800,
}

const cloudRightImageDay = {
  src: '/images/map/cloud_right2.png',
  width: 2502,
  height: 4800,
}

const flagImage = {
  src: '/images/map/flag.png',
  width: 624,
  height: 268,
}

const flagAnimation = (scale: number) => keyframes`
  from {
    background-position: 0 center;
  }
  to {
    background-position: -${flagImage.width * scale}px center;
  }
`

const cloudOffsetMultiplier = 20

const maxCloudOffset = Math.log(2) * cloudOffsetMultiplier

const noOffset = { x: 0, y: 0 }

export const MAP_WIDTH = mapImage.width / 2

export const MAP_HEIGHT = mapImage.height / 2

const StyledContainer = styled.div<{ padding: number }>`
  position: absolute;
  left: ${({ padding }) => padding}px;
  right: ${({ padding }) => padding}px;
  top: ${({ padding }) => padding}px;
  bottom: ${({ padding }) => padding}px;
  overflow: hidden;
  user-select: none;
`

const StyledFlag = styled.span<{ scale: number }>`
  position: absolute;
  top: 16.8%;
  left: 51.88%;
  width: ${({ scale }) => (flagImage.width / 2 / 3) * scale}px;
  height: ${({ scale }) => (flagImage.height / 2) * scale}px;
  background: left center / ${({ scale }) => (flagImage.width / 2) * scale}px
    ${({ scale }) => (flagImage.height / 2) * scale}px url(${flagImage.src});
  animation: ${({ scale }) => flagAnimation(scale)} 0.4s steps(3) infinite;
`

const StyledBackgroundLayer = styled.div<{ scale: number; offset: Position; day?: boolean }>`
  position: absolute;
  z-index: 0;
  left: calc(50% - ${({ scale }) => (MAP_WIDTH / 2) * scale}px);
  top: calc(50% - ${({ scale }) => (MAP_HEIGHT / 2) * scale}px);
  width: ${({ scale }) => MAP_WIDTH * scale}px;
  height: ${({ scale }) => MAP_HEIGHT * scale}px;
  background: center / cover url(${({ day }) => (day ? mapImageDay.src : mapImage.src)});
  transform: translate(${({ offset }) => `${offset.x}px, ${offset.y}px`});
`

const StyledPinsLayer = styled.div<{ scale: number; offset: Position }>`
  position: absolute;
  z-index: 0;
  left: calc(50% - ${({ scale }) => (MAP_WIDTH / 2) * scale}px);
  top: calc(50% - ${({ scale }) => (MAP_HEIGHT / 2) * scale}px);
  width: ${({ scale }) => MAP_WIDTH * scale}px;
  height: ${({ scale }) => MAP_HEIGHT * scale}px;
  pointer-events: none;
  transform: translate(${({ offset }) => `${offset.x}px, ${offset.y}px`});
`

const StyledCloudsLayer = styled.div.attrs<{
  scale: number
  containerSize: { width: number; height: number }
  offset: Position
  day?: boolean
}>(props => ({
  style: {
    transform: `translate(${props.offset.x}px, ${props.offset.y}px)`,
  },
}))<{ scale: number; containerSize: { width: number; height: number }; offset: Position; day?: boolean }>`
  position: absolute;
  left: calc(50% - ${({ scale, containerSize }) => (containerSize.width / 2) * scale}px);
  top: calc(50% - ${({ scale, containerSize }) => (containerSize.height / 2) * scale}px);
  width: ${({ scale, containerSize }) => containerSize.width * scale}px;
  height: ${({ scale, containerSize }) => containerSize.height * scale}px;
  z-index: 1;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: left center / auto 100% url(${({ day }) => (day ? cloudLeftImageDay.src : cloudLeftImage.src)})
      no-repeat;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: right center / auto 100% url(${({ day }) => (day ? cloudRightImageDay.src : cloudRightImage.src)})
      no-repeat;
  }
`

const StyledPin = styled(Pin)`
  position: absolute;
  top: calc(
    50% + ${({ pin }) => pin.position.y}% -
      ${({ pin, width }) => (pin.image.height * (width / (pin.image.width / 3))) / 2}px
  );
  left: calc(50% + ${({ pin }) => pin.position.x}% - ${({ width }) => width / 2}px);
  pointer-events: auto;
`

const useTransformedPosition = (pos: Position, transform: (pos: Position) => Position): Position => {
  return useMemo(() => transform(pos), [pos, transform])
}

const useMapSize = (containerSize: { width: number; height: number }) => {
  const containerRatio = containerSize.width / containerSize.height
  const mapRatio = MAP_WIDTH / MAP_HEIGHT

  return useMemo(() => {
    if (containerRatio > mapRatio) {
      // width: 100%
      return {
        width: containerSize.width,
        height: containerSize.width / mapRatio,
      }
    }

    // height: 100%
    return {
      width: containerSize.height * mapRatio,
      height: containerSize.height,
    }
  }, [containerSize.width, containerSize.height, containerRatio, mapRatio])
}

const useCloudOffsetTransform = (size?: { width: number; height: number }) => {
  return useCallback(
    (pos: Position): Position => ({
      x:
        Math.log(Math.abs(pos.x) / ((size?.width || MAP_WIDTH) / 2) + 1) *
        cloudOffsetMultiplier *
        Math.sign(pos.x) *
        -1,
      y:
        Math.log(Math.abs(pos.y) / ((size?.height || MAP_HEIGHT) / 2) + 1) *
        cloudOffsetMultiplier *
        Math.sign(pos.y) *
        -1,
    }),
    [size]
  )
}

export interface MapProps {
  className?: string
  hideCloud?: boolean
}

export function FixedMap({ className, hideCloud }: MapProps) {
  const day = ((new Date().getHours() + 6) % 24) - 12 > 0
  const containerRef = useRef() as RefObject<HTMLDivElement>
  const size = useSize(containerRef)
  const containerSize = size || { width: MAP_WIDTH, height: MAP_HEIGHT }
  const { isMobile } = useBreakpoints()
  const mapSize = useMapSize(containerSize)
  const imageScale = mapSize.width / MAP_WIDTH
  const cloudContainerScale =
    1 + Math.max((maxCloudOffset * 2) / (size?.width ?? MAP_WIDTH), (maxCloudOffset * 2) / (size?.height ?? MAP_HEIGHT))
  const mapOffset = isMobile ? { x: -(size?.width ?? MAP_WIDTH) * 0.07, y: 0 } : noOffset
  const pinWidth = isMobile ? 100 : 120

  return (
    <StyledContainer className={className} ref={containerRef} padding={0}>
      <StyledBackgroundLayer day={day} scale={imageScale} offset={mapOffset} />
      <StyledPinsLayer scale={imageScale} offset={mapOffset}>
        <StyledFlag scale={imageScale} />
        {pins.map(pin => (
          <StyledPin width={pinWidth} key={pin.key} pin={pin} />
        ))}
      </StyledPinsLayer>
      {!hideCloud && (
        <StyledCloudsLayer day={day} containerSize={containerSize} scale={cloudContainerScale} offset={noOffset} />
      )}
    </StyledContainer>
  )
}

export default function Map({ className, hideCloud }: MapProps) {
  const day = ((new Date().getHours() + 6) % 24) - 12 > 0
  const { isMobile } = useBreakpoints()
  const containerRef = useRef() as RefObject<HTMLDivElement>
  const size = useSize(containerRef)
  const containerSize = size || { width: MAP_WIDTH, height: MAP_HEIGHT }
  const mapSize = useMapSize(containerSize)
  const cloudContainerScale =
    1 + Math.max((maxCloudOffset * 2) / (size?.width ?? MAP_WIDTH), (maxCloudOffset * 2) / (size?.height ?? MAP_HEIGHT))
  const imageScale = mapSize.width / MAP_WIDTH
  const pos = useMouseRelativePosition()

  const cloudOffsetTransform = useCloudOffsetTransform(size)
  const cloudOffset = useTransformedPosition(pos, cloudOffsetTransform)
  const pinWidth = isMobile ? 100 : 120

  return (
    <StyledContainer className={className} ref={containerRef} padding={2}>
      <StyledBackgroundLayer day={day} scale={imageScale} offset={noOffset} />
      <StyledPinsLayer scale={imageScale} offset={noOffset}>
        <StyledFlag scale={imageScale} />
        {pins.map(pin => (
          <StyledPin width={pinWidth} key={pin.key} pin={pin} />
        ))}
      </StyledPinsLayer>
      {!hideCloud && (
        <StyledCloudsLayer day={day} containerSize={containerSize} scale={cloudContainerScale} offset={cloudOffset} />
      )}
    </StyledContainer>
  )
}
