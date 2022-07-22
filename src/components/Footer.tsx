import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'

const StyledFooter = styled.div`
  width: 100%;
  min-height: 50px;
  max-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`

const Footer = () => {
  return (
    <StyledFooter>
      <Caption as="p">Ottopia © 2022 OtterClam All Rights Reserved</Caption>
    </StyledFooter>
  )
}

export default Footer
