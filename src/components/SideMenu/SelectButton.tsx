import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import CheckedBox from './checkbox-checked.svg'
import UncheckedBox from './checkbox-unchecked.svg'

const StyledButton = styled.button<{ selected: boolean }>`
  background: white;
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 12px 20px;
  border: 3px solid ${({ theme, selected }) => (selected ? theme.colors.otterBlue : theme.colors.lightGray400)};
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledBox = styled.img`
  width: 24px;
  height: 24px;
`

interface Props {
  title: string
  selected: boolean
  onClick: () => void
}

export default function SelectButton({ title, selected, onClick }: Props) {
  return (
    <StyledButton selected={selected} onClick={onClick}>
      <ContentSmall>{title}</ContentSmall>
      <StyledBox src={selected ? CheckedBox : UncheckedBox} />
    </StyledButton>
  )
}
