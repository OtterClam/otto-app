import styled from 'styled-components'
import { Caption } from 'styles/typographs'

const StyledFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
`

const Footer = () => {
  return (
    <StyledFooter>
      <Caption>Ottopia © 2022 OtterClam All Rights Reserved</Caption>
    </StyledFooter>
  )
}

export default Footer
