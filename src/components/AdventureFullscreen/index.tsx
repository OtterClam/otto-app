import { ComponentProps } from 'react'
import Fullscreen from 'components/Fullscreen'
import styled from 'styled-components/macro'
import CloseButton, { CloseButtonProps } from 'components/CloseButton'
import noop from 'lodash/noop'

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  z-index: 1;
  right: 3px;
  top: 3px;
`

const StyledFullscreen = styled(Fullscreen)`
  border-radius: 10px !important;
  max-width: 800px;
  border-width: 2px !important;
  border-color: ${({ theme }) => theme.colors.crownYellow} !important;
  background-color: ${({ theme }) => theme.colors.otterBlack} !important;
  box-shadow: inset 1px 0 0 ${({ theme }) => theme.colors.otterBlack},
    inset -1px 0 0 ${({ theme }) => theme.colors.otterBlack}, inset 0 1px 0 ${({ theme }) => theme.colors.otterBlack},
    inset 0 -1px 0 ${({ theme }) => theme.colors.otterBlack}, 1px 0 0 ${({ theme }) => theme.colors.otterBlack},
    -1px 0 0 ${({ theme }) => theme.colors.otterBlack}, 0 1px 0 ${({ theme }) => theme.colors.otterBlack},
    0 -1px 0 ${({ theme }) => theme.colors.otterBlack};
`

export type AdventureFullscreenProps = ComponentProps<typeof Fullscreen> & {
  hideCloseButton?: boolean
  closeButtonColor?: CloseButtonProps['color']
}

export default function AdventureFullscreen({
  children,
  hideCloseButton,
  closeButtonColor,
  onRequestClose = noop,
  ...restProps
}: AdventureFullscreenProps) {
  return (
    <StyledFullscreen {...restProps}>
      {!hideCloseButton && <StyledCloseButton color={closeButtonColor} onClose={onRequestClose} />}
      {children}
    </StyledFullscreen>
  )
}
