import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

interface Props {
  name: string
  icon?: string
  balance: string
  balanceIcon?: string
}

const StyledBalanceCell = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
`

const StyledName = styled(Note).attrs({ as: 'p' })`
  width: 100%;
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.darkBrown};
  text-align: center;
  padding: 5px;
  justify-content: center;
`

const StyledBalance = styled(Note).attrs({ as: 'p' })`
  width: 100%;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding: 5px;
`

const StyledIcon = styled.img`
  width: 18px;
  height: 18px;
`

export default function BalanceCell({ name, icon, balance, balanceIcon }: Props) {
  return (
    <StyledBalanceCell>
      <StyledName>
        {icon && <StyledIcon src={icon} />}
        {name}
      </StyledName>
      <StyledBalance>
        {balanceIcon && <StyledIcon src={balanceIcon} />}
        {balance}
      </StyledBalance>
    </StyledBalanceCell>
  )
}
