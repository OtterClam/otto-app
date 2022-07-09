import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'

export enum Background {
  Dark,
  White,
}

const StyledBorder = styled.div`
  max-width: 1200px;
  flex: 1;
  width: 90%;
  overflow: hidden;
  padding: 6px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  box-sizing: border-box;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.crownYellow};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerBorder = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: var(--body-height);
`

const StyledContainer = styled.div<{ background: Background }>`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background-color: ${({ theme, background }) =>
    background === Background.White ? theme.colors.white : theme.colors.otterBlack};
`

export interface BoardProps {
  background?: Background
}

export default function Board({ background = Background.White, children }: PropsWithChildren<BoardProps>) {
  return (
    <StyledBorder>
      <StyledInnerBorder>
        <StyledContainer background={background}>{children}</StyledContainer>
      </StyledInnerBorder>
    </StyledBorder>
  )
}
