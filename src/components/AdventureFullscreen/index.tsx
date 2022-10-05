import { ComponentProps } from 'react'
import Fullscreen from 'components/Fullscreen'
import styled from 'styled-components'
import CloseButton from 'components/CloseButton'
import noop from 'lodash/noop'

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  z-index: 1;
  right: 3px;
  top: 3px;
`

const StyledFullscreen = styled(Fullscreen)`
  z-index: 0;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.crownYellow};
  box-shadow: inset 1px 0 0 ${({ theme }) => theme.colors.otterBlack},
    inset -1px 0 0 ${({ theme }) => theme.colors.otterBlack}, inset 0 1px 0 ${({ theme }) => theme.colors.otterBlack},
    inset 0 -1px 0 ${({ theme }) => theme.colors.otterBlack}, 1px 0 0 ${({ theme }) => theme.colors.otterBlack},
    -1px 0 0 ${({ theme }) => theme.colors.otterBlack}, 0 1px 0 ${({ theme }) => theme.colors.otterBlack},
    0 -1px 0 ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  max-height: calc(100% - 2px);

  .fullscreen-inner {
    padding: 35px 18px 15px;
  }
`

export type AdventureFullscreenProps = ComponentProps<typeof Fullscreen>

export default function AdventureFullscreen({
  children,
  onRequestClose = noop,
  ...restProps
}: AdventureFullscreenProps) {
  return (
    <StyledFullscreen {...restProps} bodyClassName="fullscreen-inner">
      <StyledCloseButton onClose={onRequestClose} />
      {children}
    </StyledFullscreen>
  )
}
