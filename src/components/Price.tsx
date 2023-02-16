import { BigNumberish, utils } from 'ethers'
import { trim } from 'helpers/trim'
import { TokenInfo } from 'hooks/token-info'
import styled from 'styled-components/macro'

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

export interface PriceProps {
  token: TokenInfo
  amount: BigNumberish
  showSymbol?: boolean
}

export default function Price({ token, amount, showSymbol }: PriceProps) {
  return (
    <StyledContainer>
      <StyledIcon image={token.icon.src} />
      <span>
        {trim(utils.formatUnits(amount, token.decimal), 4)} {showSymbol && token.symbol}
      </span>
    </StyledContainer>
  )
}
