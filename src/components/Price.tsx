import clam from 'assets/clam.png'
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
  [Token.Clam]: clam,
}

const tokenDecimal = {
  [Token.Clam]: 9,
}

export interface PriceProps {
  token: Token
  amount: BigNumberish
}

export default function Price({ token, amount }: PriceProps) {
  return (
    <StyledContainer>
      <StyledIcon image={icons[token]} />
      <span>{trim(utils.formatUnits(amount, tokenDecimal[token]), 2)}</span>
    </StyledContainer>
  )
}
