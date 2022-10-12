import styled from 'styled-components/macro'

export default styled.div<{ progress: number }>`
  grid-area: bar;
  height: 4px;
  border-radius: 50vh;
  background: ${({ theme }) => theme.colors.darkGray400};

  &::before {
    display: block;
    border-radius: 50vh;
    height: 100%;
    width: ${({ progress }) => progress * 100}%;
    content: '';
    background: linear-gradient(90deg, #9cfe9f 0%, #9ce0ff 50%, #ffada9 100%);
  }
`
