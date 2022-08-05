import IconButton from 'components/IconButton'
import { useBreakpoints } from 'contexts/Breakpoints'
import { Position, useMouseRelativePosition } from 'contexts/MouseRelativePosition'
import useSize from 'hooks/useSize'
import Link from 'next/link'
import { RefObject, useCallback, useMemo, useRef } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import mapImage from './city_center.jpg'
import cloudLeftImage from './cloud_left.png'
import cloudRightImage from './cloud_right.png'
import { pins } from './pins'
import flagImage from './flag.png'

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

const StyledContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const StyledFlag = styled.span<{ scale: number }>`
  position: absolute;
  top: 12.8%;
  left: 53.33%;
  width: ${({ scale }) => flagImage.width / 2 / 3 * scale}px;
  height: ${({ scale }) => flagImage.height / 2 * scale}px;
  background: left center / ${({ scale }) => flagImage.width / 2 * scale}px ${({ scale }) => flagImage.height / 2 * scale}px url(${flagImage.src});
  animation: ${({ scale }) => flagAnimation(scale)} .8s steps(3) infinite;
`

const StyledBackgroundLayer = styled.div<{ scale: number; offset: Position }>`
  position: absolute;
  z-index: 0;
  left: calc(50% - ${({ scale }) => (MAP_WIDTH / 2) * scale}px);
  top: calc(50% - ${({ scale }) => (MAP_HEIGHT / 2) * scale}px);
  width: ${({ scale }) => MAP_WIDTH * scale}px;
  height: ${({ scale }) => MAP_HEIGHT * scale}px;
  background: center / cover url(${mapImage.src});
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

const StyledCloudsLayer = styled.div<{ scale: number; offset: Position }>`
  position: absolute;
  left: calc(50% - ${({ scale }) => (MAP_WIDTH / 2) * scale}px);
  top: calc(50% - ${({ scale }) => (MAP_HEIGHT / 2) * scale}px);
  width: ${({ scale }) => MAP_WIDTH * scale}px;
  height: ${({ scale }) => MAP_HEIGHT * scale}px;
  z-index: 1;
  pointer-events: none;
  transform: translate(${({ offset }) => `${offset.x}px, ${offset.y}px`});

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: ${({ scale }) => (cloudLeftImage.width / 2) * scale}px;
    height: ${({ scale }) => (cloudLeftImage.height / 2) * scale}px;
    background: center / cover url(${cloudLeftImage.src});
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: ${({ scale }) => (cloudRightImage.width / 2) * scale}px;
    height: ${({ scale }) => (cloudRightImage.height / 2) * scale}px;
    background: center / cover url(${cloudRightImage.src});
  }
`

const StyledPin = styled(props => <IconButton {...props} as="a" />)<{ position: { x: number; y: number } }>`
  position: absolute;
  top: calc(50% + ${({ position }) => position.y}% - ${({ icon }) => icon.height / 2}px);
  left: calc(50% + ${({ position }) => position.x}% - ${({ icon }) => icon.width / 2}px);
  pointer-events: auto;
`

const StyledDisabledPin = styled(IconButton)<{ position: { x: number; y: number } }>`
  position: absolute;
  top: calc(50% + ${({ position }) => position.y}% - ${({ icon }) => icon.height / 2}px);
  left: calc(50% + ${({ position }) => position.x}% - ${({ icon }) => icon.width / 2}px);
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
  }, [containerSize.width, containerSize.height])
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
  const containerRef = useRef() as RefObject<HTMLDivElement>
  const size = useSize(containerRef)
  const { isMobile } = useBreakpoints()
  const mapSize = useMapSize(size || { width: MAP_WIDTH, height: MAP_HEIGHT })
  const imageScale = mapSize.width / MAP_WIDTH
  const mapOffset = isMobile ? { x: -(size?.width ?? MAP_WIDTH) * 0.08, y: 0 } : noOffset

  return (
    <StyledContainer className={className} ref={containerRef}>
      <StyledBackgroundLayer scale={imageScale} offset={mapOffset} />
      <StyledPinsLayer scale={imageScale} offset={mapOffset}>
        <StyledFlag scale={imageScale} />
        {pins.map(pin =>
          pin.link ? (
            <Link key={pin.key} href={pin.link} passHref>
              <StyledPin icon={pin.image} position={pin.position} />
            </Link>
          ) : (
            <StyledDisabledPin key={pin.key} disabled icon={pin.image} position={pin.position} />
          )
        )}
      </StyledPinsLayer>
      {!hideCloud && <StyledCloudsLayer scale={imageScale} offset={noOffset} />}
    </StyledContainer>
  )
}

export default function Map({ className, hideCloud }: MapProps) {
  const containerRef = useRef() as RefObject<HTMLDivElement>
  const size = useSize(containerRef)
  const mapSize = useMapSize(size || { width: MAP_WIDTH, height: MAP_HEIGHT })
  const cloudContainerScale =
    1 + Math.max((maxCloudOffset * 2) / (size?.width ?? MAP_WIDTH), (maxCloudOffset * 2) / (size?.height ?? MAP_HEIGHT))
  const imageScale = mapSize.width / MAP_WIDTH
  const pos = useMouseRelativePosition()

  const cloudOffsetTransform = useCloudOffsetTransform(size)
  const cloudOffset = useTransformedPosition(pos, cloudOffsetTransform)

  return (
    <StyledContainer className={className} ref={containerRef}>
      <StyledBackgroundLayer scale={imageScale} offset={noOffset} />
      <StyledPinsLayer scale={imageScale} offset={noOffset}>
        <StyledFlag scale={imageScale} />
        {pins.map(pin =>
          pin.link ? (
            <Link key={pin.key} href={pin.link} passHref>
              <StyledPin icon={pin.image} position={pin.position} />
            </Link>
          ) : (
            <StyledDisabledPin key={pin.key} disabled icon={pin.image} position={pin.position} />
          )
        )}
      </StyledPinsLayer>
      {!hideCloud && <StyledCloudsLayer scale={imageScale * cloudContainerScale} offset={cloudOffset} />}
    </StyledContainer>
  )
}