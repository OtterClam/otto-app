import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import ribbonImage from './ribbon.png'

const StyledContainer = styled(Note)`
  width: fit-content;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 ${ribbonImage.width / 2}px -4px ${ribbonImage.width / 2}px;
  background: ${({ theme }) => theme.colors.crownYellow};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-left: none;
  border-right: none;
  height: 24px;
  box-sizing: border-box;

  &::before,
  &::after {
    position: absolute;
    top: -2px;
    content: '';
    width: ${ribbonImage.width / 2}px;
    height: ${ribbonImage.height / 2}px;
    background: center / cover url(${ribbonImage.src});
  }

  &::before {
    left: -${ribbonImage.width / 2}px;
  }

  &::after {
    transform: rotateY(180deg);
    right: -${ribbonImage.width / 2}px;
  }
`

export default function AdventureRibbonText({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <StyledContainer className={className}>{children}</StyledContainer>
}
