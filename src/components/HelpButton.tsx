import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import Help from './Help'

const StyledButton = styled(Note).attrs({ as: 'button' })`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 9px;
  padding-top: 2px;

  &::before {
    content: '?';
  }
`

export interface HelpButtonProps {
  message: string
  className?: string
}

export default function HelpButton({ message, className }: HelpButtonProps) {
  return (
    <Help message={message} className={className} noicon>
      <StyledButton />
    </Help>
  )
}
