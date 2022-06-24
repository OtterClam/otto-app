import styled from 'styled-components/macro'
import CurtainImage from './curtain.png'

const Curtain = styled.div`
  height: 73px;
  background-image: url(${CurtainImage.src});
  background-repeat: repeat-x;
  background-size: 112px 73px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 36px;
    background-size: 50px 36px;
  }
`

export default Curtain
