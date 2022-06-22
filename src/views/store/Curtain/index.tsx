import styled from 'styled-components/macro'
import CurtainImage from './curtain.png'

const Curtain = styled.div`
  height: 73px;
  background-image: url(${CurtainImage.src});
  background-repeat: repeat-x;
  background-size: 112px 73px;
`

export default Curtain
