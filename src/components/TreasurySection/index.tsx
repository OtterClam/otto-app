import SectionRope from 'components/SectionRope'
import { forwardRef, PropsWithChildren, RefObject } from 'react'
import styled from 'styled-components/macro'
import EdgeXL from './golden_edge_xl.png'
import EdgeXS from './golden_edge_xs.png'

const StyledContainer = styled.div`
  position: relative;
  border: 6px ${({ theme }) => theme.colors.lightBrown} solid;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.otterBlack},
    inset 0 0 0 2px ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.darkBrown};
  box-sizing: border-box;
  padding: 2px;
`

const StyledCorner = styled.span<{ position: 'lt' | 'lb' | 'rt' | 'rb' }>`
  position: absolute;
  z-index: 1;
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

export default forwardRef<unknown, PropsWithChildren<TreasurySectionProps>>(function TreasurySection(
  { className, children, showRope = true },
  ref
) {
  return (
    <>
      <StyledContainer ref={ref as RefObject<HTMLDivElement>} className={className}>
        {children}
        <StyledCorner position="lt" />
        <StyledCorner position="lb" />
        <StyledCorner position="rt" />
        <StyledCorner position="rb" />
      </StyledContainer>
      {showRope && <SectionRope />}
    </>
  )
})
