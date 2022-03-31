import styled, { keyframes } from 'styled-components'

const StyledProgressBar = styled.div<{ height: string }>`
  min-height: ${({ height }) => height};
  border-radius: 6px;
  background-color: #f2efef;
  overflow: hidden;
`

const BarAnimation = keyframes`
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 40px;
    }
`

const StyledInnerProgressBar = styled.div<{ height: string; progress: number }>`
  background-image: linear-gradient(
    135deg,
    #3b4bd8 25%,
    #626fe0 25%,
    #626fe0 50%,
    #3b4bd8 50%,
    #3b4bd8 75%,
    #626fe0 75%,
    #626fe0 100%
  );
  background-size: 40px 40px;

  width: ${({ progress }) => progress}%;
  height: ${({ height }) => height};

  animation: ${BarAnimation} 3s linear infinite;
`

interface Props {
  className?: string
  height: string
  progress: number
}

export default function ProgressBar({ className, height, progress }: Props) {
  return (
    <StyledProgressBar className={className} height={height}>
      <StyledInnerProgressBar height={height} progress={progress} />
    </StyledProgressBar>
  )
}
