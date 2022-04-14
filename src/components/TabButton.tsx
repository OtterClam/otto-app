import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'

const StyledTabButton = styled.button<{ selected: boolean }>`
  padding: 12px 32px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 6px;
  color: ${({ theme, selected }) => (selected ? theme.colors.white : theme.colors.otterBlack)};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.otterBlue : theme.colors.white)};
`

interface Props {
  selected: boolean
  onClick: () => void
}

export default function TabButton({ selected, onClick, children }: PropsWithChildren<Props>) {
  return (
    <StyledTabButton selected={selected} onClick={onClick}>
      {children}
    </StyledTabButton>
  )
}
