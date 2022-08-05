import { useState } from 'react'
import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'

const StyledDropdown = styled.div`
  position: relative;
  cursor: url('/cursor-pointer.png') 7 0, auto;
`

const StyledSelected = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 5px 10px;
  border-radius: 6px;
`

const StyledOptions = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 5px 10px;
  position: absolute;
  z-index: 99;
  background: ${({ theme }) => theme.colors.white};
  top: 0;
`

const StyledOption = styled(ContentSmall).attrs({ as: 'li' })`
  list-style: none;
`

interface Props {
  selected: string
  options: string[]
  onSelect: (option: string) => void
}

export default function Dropdown({ selected, options, onSelect }: Props) {
  const [show, setShow] = useState(false)
  return (
    <StyledDropdown>
      <StyledSelected onClick={() => setShow(show => !show)}>{selected}</StyledSelected>
      {show && (
        <StyledOptions>
          {options.map((option, i) => (
            <StyledOption
              key={i}
              onClick={() => {
                setShow(false)
                onSelect(option)
              }}
            >
              {option}
            </StyledOption>
          ))}
        </StyledOptions>
      )}
    </StyledDropdown>
  )
}
