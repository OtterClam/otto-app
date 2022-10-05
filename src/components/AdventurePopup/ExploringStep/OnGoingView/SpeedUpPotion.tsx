import styled from 'styled-components/macro'
import Image from 'next/image'
import { ContentLarge, Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'

const StyledSpeedUpPotion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const StyledUseButton = styled(Note).attrs({ as: 'button' })<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlue};
  border-radius: 4px;
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  text-align: center;
  padding: 0 10px;

  &:disabled {
    background: ${({ theme }) => theme.colors.darkGray300};
  }
`

interface Props {
  hasAmount: number
  image: string
  reducedTime: string
  loading: boolean
  onClick: () => void
}

export default function SpeedUpPotion({ hasAmount, image, reducedTime, loading, onClick }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })

  return (
    <StyledSpeedUpPotion onClick={onClick}>
      <StyledPotionContainer>
        <Image src={image} width={64} height={64} unoptimized />
        {hasAmount > 0 && <StyledAmount>x{hasAmount}</StyledAmount>}
        <StyledReducedTime>{reducedTime}</StyledReducedTime>
      </StyledPotionContainer>
      <StyledUseButton disabled={!hasAmount || loading}>{t('use')}</StyledUseButton>
    </StyledSpeedUpPotion>
  )
}
