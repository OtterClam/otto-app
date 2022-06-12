import styled from 'styled-components/macro'

const StyledRichContent = styled.div`
  text-align: left;

  strong {
    color: ${props => props.theme.colors.clamPink};
  }

  ul {
    margin: 1em 0 1em 1em;
  }
`

export default StyledRichContent
