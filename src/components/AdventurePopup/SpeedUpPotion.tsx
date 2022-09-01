import styled from 'styled-components/macro'
import Image from 'next/image'
import { ContentLarge, Note } from 'styles/typography'

const StyledSpeedUpPotion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledPotionContainer = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`

const StyledAmount = styled(Note).attrs({ as: 'p' })`
  position: absolute;
  top: 0;
  left: -3px;
  padding: 0 5px;
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledReducedTime = styled(ContentLarge).attrs({ as: 'p' })`
  position: absolute;
  right: 5px;
  bottom: 0;
`

const StyledAmountContainer = styled(Note).attrs({ as: 'div' })`
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 4px;
  /* padding: 2px 10px; */
  align-items: center;
`

const StyledAmountBtn = styled.button<{ enabled: boolean }>`
  width: 22px;
  height: 22px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ enabled, theme }) => (enabled ? theme.colors.otterBlue : theme.colors.darkGray200)};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 4px;
`

interface Props {
  hasAmount: number
  useAmount: number
  image: string
  reducedTime: string
}

export default function SpeedUpPotion({ hasAmount, useAmount, image, reducedTime }: Props) {
  return (
    <StyledSpeedUpPotion>
      <StyledPotionContainer>
        <Image src={image} width={64} height={64} unoptimized />
        <StyledAmount>x{hasAmount}</StyledAmount>
        <StyledReducedTime>{reducedTime}</StyledReducedTime>
      </StyledPotionContainer>
      <StyledAmountContainer>
        <StyledAmountBtn enabled={useAmount > 0}>-</StyledAmountBtn>
        {useAmount}
        <StyledAmountBtn enabled={useAmount < hasAmount}>+</StyledAmountBtn>
      </StyledAmountContainer>
    </StyledSpeedUpPotion>
  )
}
