import styled, { keyframes } from 'styled-components/macro'
import image from 'assets/dice-animation.png'

const opacity = keyframes`
  0%   {opacity: 1;}
  35%  {opacity: 0;}
  65%  {opacity: 0;}
  100% {opacity: 1;}
`

const StyledContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 320px;
  height: 320px;
`

const StyledDice = styled.div<{ n: number }>`
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 320px;
  background: url(${image}) ${props => (props.n % 3) * -640}px ${props => Math.floor(props.n / 3) * -640}px;
  background-size: 960px 960px;
  animation: ${opacity} 0.3s infinite;
  animation-delay: ${props => (props.n + 1) * 250}ms;
`

export default function DiceAnimation() {
  return (
    <StyledContainer>
      <StyledDice n={7} />
      <StyledDice n={6} />
      <StyledDice n={5} />
      <StyledDice n={4} />
      <StyledDice n={3} />
      <StyledDice n={2} />
      <StyledDice n={1} />
      <StyledDice n={0} />
    </StyledContainer>
  )
}
