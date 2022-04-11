import styled, { keyframes } from 'styled-components'

const Animation = keyframes`
  0% {
    background-position: -468px 0
  }
  100% {
    background-position: 468px 0
  }
`

const Loading = styled.div<{ width: string; height?: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height || '100%'};

  animation-duration: 1.8s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${Animation};
  animation-timing-function: linear;
  background: #f6f7f8;
  background: linear-gradient(to right, #f7f9fb 8%, #e9f0f3 38%, #f7f9fb 54%);
  background-size: 1000px 640px;

  /* position: relative; */
`

export default Loading
