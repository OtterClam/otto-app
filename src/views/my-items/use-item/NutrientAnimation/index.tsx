import styled, { keyframes } from 'styled-components/macro'
import PotionAnimation from './potion-animation.gif'

const StyledAnimation = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`

const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
`

interface Props {
  className?: string
}

export default function NutrientAnimation({ className }: Props) {
  return (
    <StyledAnimation className={className}>
      <StyledImg src={PotionAnimation.src} />
    </StyledAnimation>
  )
}
