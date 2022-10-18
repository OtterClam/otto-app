import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

const StyledContainer = styled.div<{ ready: boolean; progress: number }>`
  grid-area: bar;
  height: 4px;
  border-radius: 50vh;
  background: ${({ theme }) => theme.colors.darkGray400};

  &::before {
    display: block;
    border-radius: 50vh;
    height: 100%;
    width: ${({ progress }) => progress * 100}%;
    content: '';
    background: linear-gradient(90deg, #9cfe9f 0%, #9ce0ff 50%, #ffada9 100%);
    ${({ ready }) =>
      ready &&
      `
      transform: width 1s;
    `}
  }
`

export interface AdventureProgressBarProps {
  fromProgress?: number
  animationDelay?: number
  progress: number
}

export default function AdventureProgressBar({
  progress,
  fromProgress = progress,
  animationDelay = 500,
}: AdventureProgressBarProps) {
  const [ready, setReady] = useState(false)
  const [displayedProgress, setDisplayedProgress] = useState(0)

  useEffect(() => {
    setReady(false)
    setDisplayedProgress(fromProgress)
  }, [fromProgress, progress])

  useBrowserLayoutEffect(() => {
    setReady(true)

    const timer = setTimeout(() => {
      setDisplayedProgress(progress)
    }, animationDelay)

    return () => {
      clearTimeout(timer)
    }
  }, [fromProgress, progress])

  return <StyledContainer ready={ready} progress={displayedProgress} />
}
