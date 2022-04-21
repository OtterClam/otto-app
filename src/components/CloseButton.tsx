import CloseIcon from 'assets/ui/close_icon_dark.svg'
import { ottoClick } from 'constant'
import styled from 'styled-components/macro'

const StyledCloseButton = styled.button`
  width: 44px;
  height: 44px;
`

const StyledCloseIcon = styled.img`
  width: 24px;
`

interface Props {
  className?: string
  onClose: () => void
}

export default function CloseButton({ className, onClose }: Props) {
  return (
    <StyledCloseButton
      className={className}
      onClick={() => {
        ottoClick.play()
        onClose()
      }}
    >
      <StyledCloseIcon src={CloseIcon} />
    </StyledCloseButton>
  )
}
