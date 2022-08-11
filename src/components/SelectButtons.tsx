import noop from 'lodash/noop'
import {
  ChangeEventHandler,
  Children,
  cloneElement,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useState,
} from 'react'
import styled from 'styled-components/macro'
import { SelectButtonProps } from './SelectButton'

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`

const StyledSelect = styled.select`
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`

export interface SelectButtonsProps<T> {
  value: T
  children: ReactElement<SelectButtonProps<T>>[] | ReactElement<SelectButtonProps<T>>
  onChange?: (value: T) => void
}

export default function SelectButtons<T = unknown>({ children, value, onChange = noop }: SelectButtonsProps<T>) {
  const [defaultValue] = useState(value)

  const handleClickEvent: MouseEventHandler = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const buttons = Children.map(children, child =>
    cloneElement(child, {
      checked: value === child.props.value,
      onClick: () => {
        onChange(child.props.value)
      },
    })
  )

  const options = Children.map(children, (child, index) => (
    <option value={index} defaultChecked={defaultValue === child.props.value}>
      {child.props.label}
    </option>
  ))

  return (
    <StyledContainer onClick={handleClickEvent}>
      {buttons}
      <StyledSelect>{options}</StyledSelect>
    </StyledContainer>
  )
}
