import { BUY_CLAM_LINK } from 'constant'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import PlusBg from './plus.png'

const StyledContainer = styled.button<{ background: string; width: number }>`
  flex: 0 ${props => props.width}px;
  display: flex;
  height: 40px;
  min-width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  align-items: center;
  background: url(${props => props.background}) 0 0;
  background-size: ${props => props.width * 2}px 40px;
  text-align: right;
  padding: 0 6px 0 20px;
  box-sizing: border-box;

  &:hover {
    background-position-x: -${props => props.width}px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 24px;
    background-size: ${props => props.width * 2}px 24px;
    padding: 0;

    &:hover {
      background-position-x: -${props => props.width}px;
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
  balance: string
  showBuyButton?: boolean
  onClick?: () => void
}

export default function Balance({
  balance,
  width,
  background,
  showBuyButton = false,
  disabled = false,
  onClick,
}: BalanceProps) {
  return (
    <StyledContainer width={width} background={background} onClick={onClick}>
      <StyledText>{balance}</StyledText>
      {showBuyButton && !disabled && <StyledBuyButton target="_blank" />}
    </StyledContainer>
  )
}
