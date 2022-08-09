import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import styled from 'styled-components/macro'
import { ContentSmall, Note } from 'styles/typography'
import Image from 'next/image'
import { trim } from 'helpers/trim'
import { ClamPondToken } from 'contracts/functions'

const StyledTokenSelector = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: absolute;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px 0;
`

const StyledSelectTokenRow = styled.button`
  display: flex;
  padding: 0 10px;
  gap: 5px;
  align-items: center;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.colors.lightGray200};
  }
`

const StyledSelectTokenRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

const StyledSelectTokenName = styled(ContentSmall)``

const StyledSelectTokenAmount = styled(Note)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

export interface TokenInfo {
  id: string
  icon: any
  balance?: BigNumber
  decimal: number
  address: string
  symbol: string
}

interface Props {
  show: boolean
  tokens: Record<string, TokenInfo>
  onSelect: (token: TokenInfo) => void
}

export default function TokenSelector({ show, tokens, onSelect }: Props) {
  return (
    <StyledTokenSelector show={show}>
      {Object.entries(tokens).map(([token, tokenInfo]) => (
        <StyledSelectTokenRow key={token} onClick={() => onSelect(tokenInfo)}>
          <Image width="22px" height="22px" src={tokenInfo.icon} layout="fixed" />
          <StyledSelectTokenRightContainer>
            <StyledSelectTokenName>{token}</StyledSelectTokenName>
            <StyledSelectTokenAmount>
              {`${tokenInfo.balance ? trim(formatUnits(tokenInfo.balance, tokenInfo.decimal), 4) : '0'} ${token}`}
            </StyledSelectTokenAmount>
          </StyledSelectTokenRightContainer>
        </StyledSelectTokenRow>
      ))}
    </StyledTokenSelector>
  )
}
