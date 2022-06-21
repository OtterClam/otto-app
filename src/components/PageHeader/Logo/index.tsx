import styled from 'styled-components/macro'
import LogoLarge from './logo-large.png'
import LogoSmall from './logo-small.png'

export default styled.div`
  flex: 0 148px;
  background: center / 148px 40px url(${LogoLarge.src});
  height: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 0 40px;
    min-width: 40px;
    background: center / 40px 40px url(${LogoSmall.src});
    width: 40px;
    height: 40px;
  }
`
