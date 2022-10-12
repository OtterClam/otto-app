import styled from 'styled-components/macro'
import ropeImage from './rope.png'
import bottomImage from './bottom.png'

const StyledContainer = styled.div<{ vertical?: boolean }>`
  display: flex;
  justify-content: space-between;
  height: 21px;

  &::before,
  &::after {
    flex: 0;
    display: block;
    content: '';
    min-width: 20px;
    max-width: 20px;
    min-height: 100%;
    max-height: 100%;
    background: bottom / 20px 12px url(${bottomImage.src}) no-repeat, bottom / 20px 9px url(${ropeImage.src});
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
    max-width: 21px;
    min-width: 21px;

    &::before, &::after {
      transform-origin: center;
      margin: 0;
    }

    &::before {
      transform: rotate(-90deg) translateX(-40px);
    }

    &::after {
      transform: rotate(-90deg) translateX(40px);
    }
  `}
`

export interface SectionRopeProps {
  className?: string
  vertical?: boolean
}

export default function SectionRope({ className, vertical }: SectionRopeProps) {
  return <StyledContainer className={className} vertical={vertical} />
}
