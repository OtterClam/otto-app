import { ComponentProps, PropsWithChildren } from 'react'
import styled from 'styled-components/macro'

interface NextImage {
  src: string
  width: number
  height: number
}

const StyledButton = styled.button<{ image: NextImage; states: string[]; scale: number }>`
  display: inline-block;
  width: ${({ image, scale, states }) => (image.width * scale) / states.length}px;
  height: ${({ image, scale }) => image.height * scale}px;
  background: left center / ${({ image, scale }) => image.width * scale}px
    ${({ image, scale }) => image.height * scale}px url(${({ image }) => image.src});
  padding: 0;
  border: none;

  ${({ states, image, scale }) =>
    states.map((state, index) =>
      state === 'default'
        ? ''
        : `
    &${state} {
      background-position: -${((image.width * scale) / states.length) * index}px center;
    }
  `
    )}
`

export interface ImageButtonProps {
  image: NextImage
  className?: string
  states?: string[]
  as?: ComponentProps<typeof StyledButton>['as']
  scale?: number
}

export default function ImageButton({ scale = 0.5, states = [], ...restProps }: PropsWithChildren<ImageButtonProps>) {
  return <StyledButton scale={scale} states={states} {...restProps} />
}
