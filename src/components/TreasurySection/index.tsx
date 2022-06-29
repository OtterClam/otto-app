import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import EdgeXL from './golden_edge_xl.png'
import EdgeXS from './golden_edge_xs.png'
import Rope from './img_rope.png'

const StyledContainer = styled.div<{ showRope: boolean }>`
  position: relative;
  border: 6px ${({ theme }) => theme.colors.lightBrown} solid;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.otterBlack},
    inset 0 0 0 2px ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.darkBrown};
  box-sizing: border-box;

  ${props =>
    props.showRope &&
    `
    margin-bottom: 21px;

    &::before, &::after {
      position: absolute;
      bottom: -29px;
      content: '';
      width: 20px;
      height: 21px;
      background: center / 20px 21px url(${Rope.src});
    }

    &::before {
      left: 8px;
    }

    &::after {
      right: 8px;
    }
  `}

  @media ${({ theme }) => theme.breakpoints.mobile} {
    &::before {
      left: 4px;
    }

    &::after {
      right: 4px;
    }
  }
`

const StyledCorner = styled.span<{ position: 'lt' | 'lb' | 'rt' | 'rb' }>`
  position: absolute;
  width: 24px;
  height: 24px;
  background: center / 48px 48px url(${EdgeXL.src});

  ${({ position }) =>
    position === 'lt' &&
    `
  top: -9px;
  left: -9px;
  background-position: left top;
  `}

  ${({ position }) =>
    position === 'lb' &&
    `
  bottom: -9px;
  left: -9px;
  background-position: left bottom;
  `}

  ${({ position }) =>
    position === 'rt' &&
    `
  top: -9px;
  right: -9px;
  background-position: right top;
  `}

  ${({ position }) =>
    position === 'rb' &&
    `
  bottom: -9px;
  right: -9px;
  background-position: right bottom;
  `}

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background-image: url(${EdgeXS.src});
  }
`

export interface TreasurySectionProps {
  className?: string
  showRope?: boolean
}

export default function TreasurySection({
  className,
  children,
  showRope = true,
}: PropsWithChildren<TreasurySectionProps>) {
  return (
    <StyledContainer showRope={showRope} className={className}>
      {children}
      <StyledCorner position="lt" />
      <StyledCorner position="lb" />
      <StyledCorner position="rt" />
      <StyledCorner position="rb" />
    </StyledContainer>
  )
}
