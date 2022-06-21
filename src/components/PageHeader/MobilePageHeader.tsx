import styled from 'styled-components/macro'
import Logo from './Logo'
import Wallet from './Wallet'
import Title from './Title'
import { PageHeaderProps } from './type'
import { ClamBalance, FishBalance, PearlBalance } from './Balance'
import MenuButton from './MenuButton'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 95%;
  padding: 5px 0 10px;
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <StyledContainer>
      <StyledRow>
        <Logo />
        <Wallet />
        <PearlBalance />
        <ClamBalance />
        <FishBalance />
      </StyledRow>
      <StyledRow>
        <Title>{title}</Title>
        <MenuButton />
      </StyledRow>
    </StyledContainer>
  )
}
