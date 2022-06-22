import styled from 'styled-components/macro'
import ButtonImg from './button.png'

const StyledGiveawayFloatingButton = styled.a`
  position: absolute;
  top: 108px;
  right: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 68px;
    right: 10px;
  }
`

const StyledButton = styled.img.attrs({
  src: ButtonImg.src,
})`
  width: 120px;
  height: 120px;
`

export default function GiveawayFloatingButton() {
  return (
    <StyledGiveawayFloatingButton href="/giveaway" target="_blank" rel="noreferrer">
      <StyledButton />
    </StyledGiveawayFloatingButton>
  )
}
