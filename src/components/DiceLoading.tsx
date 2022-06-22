import styled, { keyframes } from 'styled-components/macro'
import image from 'assets/dice-animation.png'

const opacity = keyframes`
  0%   {opacity: 0;}
  1% {opacity: 1;}
  12%  {opacity: 1;}
  15%  {opacity: 0;}
  100% {opacity: 0;}
`

const StyledContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 320px;
  height: 320px;
`

const StyledDice = styled.div<{ n: number }>`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 320px;
  background: url(${image.src}) 0 ${props => props.n * -640}px;
  background-size: 320px auto;
  animation: ${opacity} 1.6s infinite;
  animation-delay: ${props => (props.n + 1) * 200}ms;
`

export default function DiceAnimation() {
  return (
    <StyledContainer>
      <StyledDice n={0} />
      <StyledDice n={1} />
      <StyledDice n={2} />
      <StyledDice n={3} />
      <StyledDice n={4} />
      <StyledDice n={5} />
      <StyledDice n={6} />
      <StyledDice n={7} />
    </StyledContainer>
  )
}
