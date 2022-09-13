import clam from 'assets/clam.png'
import fish from 'assets/fish.png'
import { trim } from 'helpers/trim'
import { Token } from 'constant'
import styled from 'styled-components/macro'
import { BigNumberish, utils } from 'ethers'

const StyledContainer = styled.div`
  display: inline-flex;
  align-items: center;
`

interface StyledIconProps {
  image: string
}

const StyledIcon = styled.span<StyledIconProps>`
  width: 20px;
  height: 20px;
  background: no-repeat center / cover url(${props => props.image});
  margin-right: 10px;
`

const icons = {
  [Token.Clam]: clam.src,
  [Token.Fish]: fish.src,
}

const tokenDecimal = {
  [Token.Clam]: 9,
  [Token.Fish]: 18,
}

export interface PriceProps {
  token: Token
  amount: BigNumberish
  showSymbol?: boolean
}

export default function Price({ token, amount, showSymbol }: PriceProps) {
  return (
    <StyledContainer>
      <StyledIcon image={icons[token]} />
      <span>
        {trim(utils.formatUnits(amount, tokenDecimal[token]), 2)} {showSymbol && token.toLocaleUpperCase()}
      </span>
    </StyledContainer>
  )
}
