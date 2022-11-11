import CloseIcon from 'assets/ui/close_icon_dark.svg'
import WhiteCloseIcon from 'assets/ui/close_icon.svg'
import { ottoClick } from 'constant'
import styled from 'styled-components/macro'

const StyledCloseButton = styled.button`
  width: 44px;
  height: 44px;
`

const StyledCloseIcon = styled.img`
  width: 24px;
`

export interface CloseButtonProps {
  className?: string
  color?: 'white' | 'dark'
  onClose: () => void
}

export default function CloseButton({ className, color = 'dark', onClose }: CloseButtonProps) {
  return (
    <StyledCloseButton
      className={className}
      onClick={() => {
        ottoClick.play()
        onClose()
      }}
    >
      <StyledCloseIcon src={color === 'dark' ? CloseIcon.src : WhiteCloseIcon.src} />
    </StyledCloseButton>
  )
}
