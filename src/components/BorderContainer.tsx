import styled from 'styled-components/macro'

interface Props {
  size?: 'xl' | 'xs'
  borderColor?: string
}

const Sizes = {
  xl: {
    outer: '2px',
    outerRadius: '15px',
    inner: '5px',
    innerRadius: '12px',
    padding: '3px',
  },
  xs: {
    outer: '1px',
    outerRadius: '10px',
    inner: '3px',
    innerRadius: '8px',
    padding: '2px',
  },
}

const BorderContainer = styled.div<Props>`
  border: ${({ size = 'xl' }) => Sizes[size].outer} solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: ${({ size = 'xl' }) => Sizes[size].outerRadius};
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: ${({ size = 'xl' }) => Sizes[size].inner} solid
      ${({ theme, borderColor }) => borderColor || theme.colors.crownYellow};
    border-radius: ${({ size = 'xl' }) => Sizes[size].innerRadius};
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: ${({ size = 'xl' }) => Sizes[size].padding};
    left: ${({ size = 'xl' }) => Sizes[size].padding};
    right: ${({ size = 'xl' }) => Sizes[size].padding};
    bottom: ${({ size = 'xl' }) => Sizes[size].padding};
    border: ${({ size = 'xl' }) => Sizes[size].outer} solid ${({ theme }) => theme.colors.otterBlack};
    border-radius: ${({ size = 'xl' }) => Sizes[size].innerRadius};
    pointer-events: none;
  }
`

export default BorderContainer
