import styled, { keyframes } from 'styled-components/macro'

const StyledProgressBar = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
`

// const BarAnimation = keyframes`
//     0% {
//       background-position: 0 0;
//     }
//     100% {
//       background-position: 40px 40px;
//     }
// `

const StyledInnerProgressBar = styled.div<{ progress: number; color: string }>`
  background-image: ${({ color }) => color};
  background-color: ${({ color }) => color};
  border-radius: 3px;

  width: ${({ progress }) => progress}%;
  height: 100%;
`

interface Props {
  className?: string
  color: string
  progress: number
}

export default function ProgressBar({ className, color, progress }: Props) {
  return (
    <StyledProgressBar className={className}>
      <StyledInnerProgressBar progress={progress} color={color} />
    </StyledProgressBar>
  )
}
