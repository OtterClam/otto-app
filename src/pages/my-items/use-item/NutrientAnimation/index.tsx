import styled, { keyframes } from 'styled-components/macro'
import Nutrient01 from './Nutrient01.png'
import Nutrient02 from './Nutrient02.png'
import Nutrient03 from './Nutrient03.png'

const Gifprocessing1 = keyframes`
  0%   {opacity: 0;}
  25%  {opacity: 1;}
  50%  {opacity: 0;}
  75%  {opacity: 0;}
  100% {opacity: 0;}
`

const Gifprocessing2 = keyframes`
  0%   {opacity: 0;}
  25%  {opacity: 1;}
  50%  {opacity: 1;}
  75%  {opacity: 0;}
  100% {opacity: 0;}
`

const StyledAnimation = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`

const StyledGif1 = styled.img<{ delay: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  animation: ${Gifprocessing1} 2s infinite;
  animation-delay: ${({ delay }) => delay}ms;
`
const StyledGif2 = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  animation: ${Gifprocessing2} 2s infinite;
  animation-delay: 700ms;
`

interface Props {
  className?: string
}

export default function NutrientAnimation({ className }: Props) {
  return (
    <StyledAnimation className={className}>
      <StyledGif1 src={Nutrient01} delay={0} />
      <StyledGif1 src={Nutrient02} delay={350} />
      <StyledGif2 src={Nutrient03} />
    </StyledAnimation>
  )
}
