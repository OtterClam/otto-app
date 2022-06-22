import styled, { keyframes } from 'styled-components/macro'
import Opening01 from './Opening01.png'
import Opening02 from './Opening02.png'
import Opening03 from './Opening03.png'
import Opening04 from './Opening04.png'
import Opening05 from './Opening05.png'
import Opening06 from './Opening06.png'
import Opening07 from './Opening07.png'

const StyledPortalAnimation = styled.div`
  width: 360px;
  height: 360px;
`

const Animation = keyframes`
  0%   {opacity: 1;}
  50%  {opacity: 0;}
  100% {opacity: 1;}
`

const StyledPortal = styled.img<{ delay: number }>`
  position: absolute;
  width: 360px;
  height: 360px;
  left: calc(50% - 180px);
  animation: ${Animation} 1.4s infinite;
  animation-delay: ${({ delay }) => delay}ms;
`

export default function PortalAnimation() {
  return (
    <StyledPortalAnimation>
      <StyledPortal src={Opening01.src} delay={0} />
      <StyledPortal src={Opening02.src} delay={200} />
      <StyledPortal src={Opening03.src} delay={400} />
      <StyledPortal src={Opening04.src} delay={600} />
      <StyledPortal src={Opening05.src} delay={800} />
      <StyledPortal src={Opening06.src} delay={1000} />
      <StyledPortal src={Opening07.src} delay={1000} />
    </StyledPortalAnimation>
  )
}
