import styled from 'styled-components'
import { Caption } from 'styles/typography'

const StyledFooter = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Footer = () => {
  return (
    <StyledFooter>
      <p>
        <Caption>Ottopia © 2022 OtterClam All Rights Reserved</Caption>
      </p>
    </StyledFooter>
  )
}

export default Footer
