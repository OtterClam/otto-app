import { MouseEventHandler, PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall } from 'styles/typography'

export enum FlatButtonColor {
  Yellow,
  White,
}

const colors = {
  [FlatButtonColor.Yellow]: {
    light: '#f9e098',
    normal: '#f6c956',
    dark: '#cc8746',
  },
  [FlatButtonColor.White]: {
    light: '#fafcfd',
    normal: '#f8fafb',
    dark: '#c8caca',
  },
}

const StyledButton = styled(ContentExtraSmall).attrs({ as: 'button' })<{ bgColor: FlatButtonColor }>`
  position: relative;
  z-index: 0;
  background: ${({ bgColor }) => colors[bgColor].dark};
  border-radius: 8px;
  overflow: hidden;
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  user-select: none;
  outline: none;
  height: 48px;
  white-space: nowrap;
  padding: 0 10px;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    top: -2px;
    right: -2px;
    bottom: 6px;
    left: -2px;
    background: ${({ bgColor }) => colors[bgColor].normal};
    border: 6px ${({ bgColor }) => colors[bgColor].light} solid;
    border-bottom-width: 0;
    border-radius: 8px;
    box-sizing: border-box;
  }

  &:active {
    padding-top: 3px;

    &::before {
      border-width: 4px;
      border-bottom-width: 0;
      bottom: 4px;
    }
  }
`

export interface FlatButtonProps {
  className?: string
  onClick?: MouseEventHandler
  color?: FlatButtonColor
}

export default function FlatButton({
  children,
  className,
  onClick,
  color = FlatButtonColor.White,
}: PropsWithChildren<FlatButtonProps>) {
  return (
    <StyledButton className={className} onClick={onClick} bgColor={color}>
      {children}
    </StyledButton>
  )
}
