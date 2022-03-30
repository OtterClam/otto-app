import styled from 'styled-components'
import { useMemo } from 'react'
import LoadingAnimation1 from './images/loading_animation1.gif'
import LoadingAnimation2 from './images/loading_animation2.gif'

const StyledLoadingView = styled.div<{ show: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: all 0.6s ease-out;
`

const StyledImage = styled.img`
  display: block;
  width: 400px;
  height: 400px;
  transition: all 0.3s ease-out;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 200px;
    height: 200px;
  }
`

interface Props {
  show?: boolean
}

export function LoadingView({ show = true }: Props) {
  const animation = useMemo(() => {
    const LoadingScreen = Math.floor(Math.random() * 2)
    if (LoadingScreen === 1) return LoadingAnimation1
    return LoadingAnimation2
  }, [])

  return (
    <StyledLoadingView show={show}>
      <StyledImage src={animation} alt="loading animation" />
    </StyledLoadingView>
  )
}
