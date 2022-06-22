import styled from 'styled-components/macro'
import Logo from './Logo'
import Wallet from './Wallet'
import Title from './Title'
import { PageHeaderProps } from './type'
import { ClamBalance, FishBalance, PearlBalance } from './Balance'
import MenuButton from './MenuButton'

const StyledContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 68px;
`

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <StyledContainer>
      <Logo />
      <Title>{title}</Title>
      <PearlBalance />
      <ClamBalance />
      <FishBalance />
      <Wallet />
      <MenuButton />
    </StyledContainer>
  )
}
