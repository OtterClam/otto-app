import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const iconImage = '/images/adventure/tooltipicon.png'

const StyledContainer = styled(Note).attrs({ as: 'div' })`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  margin-top: 8px;

  &::before {
    flex: 0;
    display: block;
    content: '';
    min-width: 32px;
    max-width: 32px;
    height: 32px;
    background: center / cover url(${iconImage});
  }

  &::after {
    display: block;
    content: '';
    position: absolute;
    z-index: -1;
    left: 50%;
    top: -8px;
    transform: translateX(-8px) rotateZ(45deg);
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.white};
  }
`

const StyledContent = styled.div`
  flex: 1;
`

export interface AdventureTooltopProps {
  content: ReactNode
  className?: string
}

export default function AdventureTooltop({ content, className }: AdventureTooltopProps) {
  return (
    <StyledContainer className={className}>
      <StyledContent>{content}</StyledContent>
    </StyledContainer>
  )
}
