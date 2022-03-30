import styled from 'styled-components'

interface Props {
  borderColor?: string
}

const BorderContainer = styled.div<Props>`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 15px;
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 3px solid ${({ theme, borderColor }) => borderColor || theme.colors.crownYellow};
    border-radius: 12px;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    border-radius: 10px;
  }
`

export default BorderContainer
