import styled from 'styled-components/macro'
import ButtonImg from './button.png'

const StyledGiveawayFloatingButton = styled.a`
  position: absolute;
  top: 88px;
  right: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 100px;
    right: 10px;
  }
`

const StyledButton = styled.img.attrs({
  src: ButtonImg.src,
})`
  width: 96px;
  height: 96px;
`

/**
 * @deprecated use GiveawayButton instead
 */
export default function GiveawayFloatingButton() {
  return (
    <StyledGiveawayFloatingButton href="/giveaway" target="_blank" rel="noreferrer">
      <StyledButton />
    </StyledGiveawayFloatingButton>
  )
}
