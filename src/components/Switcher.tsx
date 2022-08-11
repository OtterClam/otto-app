import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import noop from 'lodash/noop'
import { RefObject, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div<{ bgLeft: number; bgWidth: number }>`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  height: 36px;
  flex-wrap: nowrap;
  background: ${({ theme }) => theme.colors.lightGray300};
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    height: 28px;
    width: ${props => props.bgWidth - 8}px;
    border-radius: 6px;
    transform: translate(${props => props.bgLeft}px);
    background: ${({ theme }) => theme.colors.white};
    z-index: -1;
    transition: all 0.2s ease;
  }
`

const StyledButton = styled(Note).attrs({ as: 'label' })`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 28px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  input {
    display: none;
  }
`

export interface SwitcherProps<T> {
  value: T
  name: string
  options: {
    label: string
    value: T
  }[]
  onChange?: (value: T) => void
}

export default function Switcher<T>({ value, name, options, onChange = noop }: SwitcherProps<T>) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const [size, setSize] = useState({ left: 0, width: 0 })

  useBrowserLayoutEffect(() => {
    if (!containerRef.current) {
      return
    }
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = containerRef.current.querySelector(`[data-value="${value}"]`)?.getBoundingClientRect()
    setSize({
      left: (rect?.left ?? 0) - containerRect.left,
      width: rect?.width ?? 0,
    })
  }, [value, containerRef.current])

  return (
    <StyledContainer bgLeft={size?.left ?? 0} bgWidth={size?.width ?? 0} ref={containerRef}>
      {options.map(option => (
        <StyledButton key={String(option.value)} data-value={option.value}>
          {option.label}
          <input
            name={name}
            type="radio"
            checked={option.value === value}
            value={String(option.value)}
            onChange={() => onChange(option.value)}
          />
        </StyledButton>
      ))}
    </StyledContainer>
  )
}
