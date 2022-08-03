import IconButton from 'components/IconButton'
import { Position, useMouseRelativePosition } from 'contexts/MouseRelativePosition'
import useSize from 'hooks/useSize'
import Link from 'next/link'
import { RefObject, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'
import mapImage from './city_center.jpg'
import cloudLeftImage from './cloud_left.png'
import cloudRightImage from './cloud_right.png'
import { layeredPins, pins } from './pins'

const mapOffsetMultiplier = 20

const pinOffsetMultiplier = [8, 9, 10]

const maxMapOffset = Math.log(2) * mapOffsetMultiplier

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

const StyledLayers = styled.div<{ scale: number }>`
  transform: scale(${({ scale }) => scale});
  height: 100%;
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
  transform: translate(${({ offset }) => `${offset.x}px, ${offset.y}px`});
  pointer-events: none;
`

const StyledCloudsLayer = styled.div<{ scale: number }>`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
  width: 100%;
  height: 100%;

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

const useBackgroundOffsetTransform = (size?: { width: number; height: number }) => {
  return useCallback(
    (pos: Position): Position => ({
      x: Math.log(Math.abs(pos.x) / ((size?.width || MAP_WIDTH) / 2) + 1) * mapOffsetMultiplier * Math.sign(pos.x) * -1,
      y:
        Math.log(Math.abs(pos.y) / ((size?.height || MAP_HEIGHT) / 2) + 1) *
        mapOffsetMultiplier *
        Math.sign(pos.y) *
        -1,
    }),
    [size]
  )
}

const usePinsOffsetTransform = (layerNo: number, size?: { width: number; height: number }) => {
  return useCallback(
    (pos: Position): Position => ({
      x:
        Math.log(Math.abs(pos.x) / ((size?.width || MAP_WIDTH) / 2) + 1) *
        pinOffsetMultiplier[layerNo - 1] *
        Math.sign(pos.x) *
        -1,
      y:
        Math.log(Math.abs(pos.y) / ((size?.height || MAP_HEIGHT) / 2) + 1) *
        pinOffsetMultiplier[layerNo - 1] *
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
  const mapSize = useMapSize(size || { width: MAP_WIDTH, height: MAP_HEIGHT })
  const layerContainerScale = 1 + maxMapOffset / mapSize.width
  const imageScale = mapSize.width / MAP_WIDTH

  return (
    <StyledContainer className={className} ref={containerRef}>
      <StyledLayers scale={layerContainerScale}>
        <StyledBackgroundLayer offset={noOffset} scale={imageScale} />
        <StyledPinsLayer scale={imageScale} offset={noOffset}>
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
      </StyledLayers>
      {!hideCloud && <StyledCloudsLayer scale={imageScale} />}
    </StyledContainer>
  )
}

export default function Map({ className, hideCloud }: MapProps) {
  const containerRef = useRef() as RefObject<HTMLDivElement>
  const size = useSize(containerRef)
  const mapSize = useMapSize(size || { width: MAP_WIDTH, height: MAP_HEIGHT })
  const layerContainerScale = 1 + maxMapOffset / mapSize.width
  const imageScale = mapSize.width / MAP_WIDTH
  const pos = useMouseRelativePosition()

  const backgroundOffsetTransform = useBackgroundOffsetTransform(size)
  const pinsLayer1OffsetTransform = usePinsOffsetTransform(1, size)
  const pinsLayer2OffsetTransform = usePinsOffsetTransform(2, size)
  const pinsLayer3OffsetTransform = usePinsOffsetTransform(3, size)

  const backgroundOffset = useTransformedPosition(pos, backgroundOffsetTransform)
  const pinsLayer1Offset = useTransformedPosition(pos, pinsLayer1OffsetTransform)
  const pinsLayer2Offset = useTransformedPosition(pos, pinsLayer2OffsetTransform)
  const pinsLayer3Offset = useTransformedPosition(pos, pinsLayer3OffsetTransform)
  const pinsLayerOffset = [pinsLayer1Offset, pinsLayer2Offset, pinsLayer3Offset]

  return (
    <StyledContainer className={className} ref={containerRef}>
      <StyledLayers scale={layerContainerScale}>
        <StyledBackgroundLayer offset={backgroundOffset} scale={imageScale} />
        {pinsLayerOffset.map((offset, index) => (
          <StyledPinsLayer key={index} scale={imageScale} offset={offset}>
            {layeredPins[index + 1].map(pin =>
              pin.link ? (
                <Link key={pin.key} href={pin.link} passHref>
                  <StyledPin icon={pin.image} position={pin.position} />
                </Link>
              ) : (
                <StyledDisabledPin key={pin.key} disabled icon={pin.image} position={pin.position} />
              )
            )}
          </StyledPinsLayer>
        ))}
      </StyledLayers>
      {!hideCloud && <StyledCloudsLayer scale={imageScale} />}
    </StyledContainer>
  )
}
