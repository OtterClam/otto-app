import { BUY_CLAM_LINK } from 'constant'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import PlusBg from './plus.png'

const StyledContainer = styled.div<{ background: string; width: number; hover: string }>`
  flex: 0 ${props => props.width}px;
  display: flex;
  height: 40px;
  min-width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  align-items: center;
  background: center / ${props => props.width}px 40px url(${props => props.background});
  text-align: right;
  padding: 0 6px 0 20px;
  box-sizing: border-box;

  &:hover {
    background: center / ${props => props.width}px 40px url(${props => props.hover});
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 24px;
    background-size: ${props => props.width}px 24px;
    padding: 0;

    &:hover {
      background: center / ${props => props.width}px 24px url(${props => props.hover});
    }
  }
`

const StyledText = styled(Caption)`
  flex: 1;
  color: ${props => props.theme.colors.white};
  margin-right: 5px;
`

const StyledBuyButton = styled.a`
  width: 22px;
  height: 22px;
  background: left / 66px 22px url(${PlusBg.src});

  &:hover {
    background-position: center;
  }

  &:active {
    background-position: right;
  }
`

export interface BalanceProps {
  disabled?: boolean
  width: number
  background: string
  hover: string
  balance: string
  showBuyButton?: boolean
}

export default function Balance({
  balance,
  width,
  background,
  hover,
  showBuyButton = false,
  disabled = false,
}: BalanceProps) {
  return (
    <StyledContainer width={width} background={background} hover={hover}>
      <StyledText>{balance}</StyledText>
      {showBuyButton && !disabled && <StyledBuyButton href={BUY_CLAM_LINK} target="_blank" />}
    </StyledContainer>
  )
}
