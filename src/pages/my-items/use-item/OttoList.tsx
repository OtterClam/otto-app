import Otto from 'models/Otto'
import { MyOttosContext } from 'MyOttosProvider'
import { useContext } from 'react'
import styled from 'styled-components/macro'

const StyledOttoList = styled.div`
  display: flex;
  gap: 8px;
`

const StyledOttoCell = styled.button<{ selected: boolean }>`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme, selected }) => (selected ? theme.colors.crownYellow : theme.colors.lightGray400)};
    border-radius: 3px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    pointer-events: none;
  }
`

const StyledOttoImage = styled.img`
  width: 50px;
  height: 50px;
  background: url(/otto-loading.jpg);
  background-size: 50px 50px;
`

interface Props {
  selectedOtto: Otto | null
  onSelect: (otto: Otto) => void
}

export default function OttoList({ selectedOtto, onSelect }: Props) {
  const { ottos } = useContext(MyOttosContext)
  return (
    <StyledOttoList>
      {ottos.map((o, index) => (
        <StyledOttoCell key={index} selected={selectedOtto === o} onClick={() => onSelect(o)}>
          <StyledOttoImage src={o.image} />
        </StyledOttoCell>
      ))}
    </StyledOttoList>
  )
}
