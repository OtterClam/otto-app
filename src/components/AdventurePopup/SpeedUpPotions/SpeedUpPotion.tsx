import styled from 'styled-components/macro'
import Image from 'next/image'
import { ContentLarge, Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import { AdventurePotion } from 'constant'

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

const StyledAmountSelector = styled(Note)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  gap: 2px;
  padding: 2px;
  border-radius: 4px;
  width: 100%;
  user-select: none;
`

const StyledIncreaseAmountButton = styled(Note).attrs({ as: 'button' })`
  color: ${({ theme }) => theme.colors.white};
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.otterBlue};
`

const StyledDecreaseAmountButton = styled(Note).attrs({ as: 'button' })<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.darkGray200};
`

interface Props {
  potion: AdventurePotion
  amounts: { [k: string]: number }
  usedAmounts: { [k: string]: number }
  targetDate: Date
  image: string
  reducedTime: string
  onChanged: (usedAmounts: { [k: string]: number }) => void
  disabled?: boolean
}

export default function SpeedUpPotion({
  amounts,
  usedAmounts,
  potion,
  targetDate,
  disabled,
  image,
  reducedTime,
  onChanged,
}: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })
  const amount = amounts[potion] ?? 0
  const usedAmount = usedAmounts[potion] ?? 0
  const hasAmount = amount - usedAmount > 0
  const duration = targetDate.getTime() - Date.now()

  return (
    <StyledSpeedUpPotion>
      <StyledPotionContainer>
        <Image src={image} width={64} height={64} unoptimized />
        {hasAmount && <StyledAmount>x{amount - usedAmount}</StyledAmount>}
        <StyledReducedTime>{reducedTime}</StyledReducedTime>
      </StyledPotionContainer>
      {!disabled && hasAmount && (
        <StyledAmountSelector>
          <StyledDecreaseAmountButton
            onClick={() =>
              onChanged({
                ...usedAmounts,
                [potion]: Math.max(usedAmount - 1, 0),
              })
            }
          >
            -
          </StyledDecreaseAmountButton>
          {usedAmount}
          <StyledIncreaseAmountButton
            onClick={() =>
              onChanged({
                ...usedAmounts,
                [potion]: usedAmount + 1,
              })
            }
          >
            +
          </StyledIncreaseAmountButton>
        </StyledAmountSelector>
      )}
      {(disabled || !hasAmount) && <StyledUseButton disabled>{t('used', { amount: usedAmount })}</StyledUseButton>}
    </StyledSpeedUpPotion>
  )
}
