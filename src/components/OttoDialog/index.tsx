import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import Arrow from './arrow.svg'

const StyledContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: white;
  border-radius: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    visibility: hidden;
  }

  &:after {
    content: '';
    width: 28px;
    height: 20px;
    background-image: url(${Arrow.src});
    background-size: 100% 100%;
    position: absolute;
    top: calc(50% - 9px);
    right: -30px;
  }
`

export interface OttoDialogProps {
  className?: string
}

export default function OttoDialog({ className, children }: PropsWithChildren<OttoDialogProps>) {
  return <StyledContainer className={className}>{children}</StyledContainer>
}
