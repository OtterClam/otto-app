import { useDispatch } from 'react-redux'
import { showSideMenu } from 'store/uiSlice'
import styled from 'styled-components/macro'
import Bg from './background.png'

const StyledButton = styled.button`
  flex: 0 40px;
  width: 40px;
  height: 40px;
  background: left / 120px 40px url(${Bg.src});

  &:hover {
    background-position: center;
  }

  &:active {
    background-position: right;
  }
`

export default function MenuButton() {
  const dispatch = useDispatch()
  const onClick = () => dispatch(showSideMenu())
  return <StyledButton onClick={onClick} />
}
