import styled from 'styled-components/macro'

export default styled.div<{ progress: number }>`
  grid-area: bar;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.darkGray400};

  &::before {
    display: block;
    border-radius: 2px;
    height: 4px;
    width: ${({ progress }) => progress * 100}%;
    content: '';
    background: linear-gradient(270deg, #9cfe9f 0%, #9ce0ff 50%, #ffada9 100%);
  }
`
