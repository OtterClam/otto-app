import noop from 'lodash/noop'
import { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { Caption } from 'styles/typography'
import CheckboxImage from './checkbox.svg'

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.colors.white};
  border: 3px ${({ theme }) => theme.colors.lightGray400} solid;
  cursor: url('/cursor-pointer.png') 7 0, auto;
  padding: 0 20px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px ${({ theme }) => theme.colors.lightGray200} solid;
  }

  &[data-checked='true'] {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.otterBlue};
    border-color: ${({ theme }) => theme.colors.otterBlueHover};

    &::after {
      border: none;
      background: center / cover url(${CheckboxImage.src});
    }
  }

  &[data-disabled='true'] {
    cursor: url('/cursor-default.png'), auto;
  }
`

export interface SelectButtonProps<T> {
  value: T
  label: string
  checked?: boolean
  className?: string
  onClick?: MouseEventHandler
}

export default function SelectButton<T = unknown>({
  value,
  className,
  label: displayText,
  checked = false,
  onClick = noop,
}: SelectButtonProps<T>) {
  return (
    <StyledContainer onClick={onClick} className={className} data-value={String(value)} data-checked={checked}>
      <Caption>{displayText}</Caption>
    </StyledContainer>
  )
}
