import styled from 'styled-components/macro'
import ButtonImg from './button.png'

const StyledOtterClamFloatingButton = styled.a`
  position: absolute;
  top: 194px;
  right: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 206px;
    right: 10px;
  }
`

const StyledButton = styled.img.attrs({
  src: ButtonImg.src,
})`
  width: 96px;
  height: 96px;
`

export default function OtterClamFloatingButton() {
  return (
    <StyledOtterClamFloatingButton href="https://app.otterclam.finance" target="_blank" rel="noreferrer">
      <StyledButton />
    </StyledOtterClamFloatingButton>
  )
}
