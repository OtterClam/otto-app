import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'

const StyledContainer = styled.div`
  padding: 15px;
  margin-bottom: 4px;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.darkBrown};
  box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
    inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
  background: ${({ theme }) => theme.colors.white};
`

export interface TreasuryCardProps {
  className?: string
}

export default function TreasuryCard({ children, className }: PropsWithChildren<TreasuryCardProps>) {
  return <StyledContainer className={className}>{children}</StyledContainer>
}
