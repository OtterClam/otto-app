import styled from 'styled-components/macro'
import Rope from './img_rope.png'

const StyledContainer = styled.div<{ vertical?: boolean }>`
  display: flex;
  justify-content: space-between;

  &::before,
  &::after {
    flex: 0;
    display: block;
    content: '';
    min-width: 20px;
    max-width: 20px;
    height: 21px;
    background: center / 20px 21px url(${Rope.src});
  }

  &::before {
    margin-left: 40px;
  }

  &::after {
    margin-right: 40px;
  }

  ${({ vertical }) =>
    vertical &&
    `
    flex-direction: column;
  `}
`

export interface SectionRopeProps {
  className?: string
  vertical?: boolean
}

export default function SectionRope({ className, vertical }: SectionRopeProps) {
  return <StyledContainer className={className} vertical={vertical} />
}
