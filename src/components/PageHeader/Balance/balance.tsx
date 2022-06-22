import { ethers } from 'ethers'
import { useEthers, useTokenBalance } from '@usedapp/core'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import { getBuyTokenUrl } from 'utils/exchange'
import PlusBg from './plus.png'

const StyledContainer = styled.div<{ background: string; width: number }>`
  flex: 0 ${props => props.width}px;
  display: flex;
  height: 40px;
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  align-items: center;
  background: center / ${props => props.width}px 40px url(${props => props.background});
  text-align: right;
  padding: 0 4px 0 20px;
  box-sizing: border-box;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 24px;
    background-size: ${props => props.width}px 24px;
    padding: 0;
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
  contractAddress: string
  showBuyButton?: boolean
}

export default function Balance({
  width,
  background,
  contractAddress,
  showBuyButton = false,
  disabled = false,
}: BalanceProps) {
  const { account } = useEthers()
  const balance = useTokenBalance(contractAddress, account)

  return (
    <StyledContainer width={width} background={background}>
      <StyledText>{disabled || !balance ? '--' : ethers.utils.formatUnits(balance, 9)}</StyledText>
      {showBuyButton && !disabled && <StyledBuyButton href={getBuyTokenUrl(contractAddress)} target="_blank" />}
    </StyledContainer>
  )
}
