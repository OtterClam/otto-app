import { ComponentProps } from 'react'
import styled from 'styled-components/macro'

const StyledButton = styled.button<{
  scale: number
  icon: {
    src: string
    width: number
    height: number
  }
}>`
  display: inline-block;
  width: ${({ icon, scale }) => icon.width * scale}px;
  height: ${({ icon, scale }) => icon.height * scale}px;
  background: center / cover url(${({ icon }) => icon.src});
  padding: 0;
  border: none;
`

// TODO: use next/image and add `alt` prop to the component
export interface IconButtonProps {
  scale?: number
  icon: {
    src: string
    width: number
    height: number
  }
  as?: ComponentProps<typeof StyledButton>['as']
  [k: string]: any
}

export default function IconButton({ icon, scale = 0.5, as, ...rest }: IconButtonProps) {
  return <StyledButton icon={icon} scale={scale} as={as} {...rest} />
}
