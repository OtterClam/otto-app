import Otto from 'models/Otto'
import { numberWithSign } from 'helpers/number'
import ConstellationIcons from 'assets/constellations'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

const StyledContainer = styled.div`
  display: flex;
  gap: 5px;
  grid-column-start: span 2;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledLabel = styled(Caption).attrs({ as: 'div' })`
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 5px;
  background: ${({ theme }) => theme.colors.lightGray300};
  border-radius: 5px;

  img {
    width: 21px;
    height: 21px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    img {
      width: 18px;
      height: 18px;
    }
  }
`

const StyledChosenOne = styled(StyledLabel)`
  background: ${({ theme }) => theme.colors.crownYellow};
`

export interface OttoBoostLabelsProps {
  otto: Otto
  isAdventure?: boolean
}

export default function OttoBoostLabels({ otto, isAdventure }: OttoBoostLabelsProps) {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.rank_list' })

  const { level, zodiacBoost, isChosenOne, themeBoost, diceCount, zodiacSign, epochRarityBoost } = otto

  if (isAdventure) {
    return (
      <StyledContainer>
        <StyledLabel>LV {level}</StyledLabel>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      {zodiacBoost > 0 &&
        (isChosenOne ? (
          <StyledChosenOne>
            <img src="/trait-icons/Birthday.png" alt="The Otter" />
            {t('chosen_one')}
          </StyledChosenOne>
        ) : (
          <StyledLabel>
            <Image src={ConstellationIcons[zodiacSign]} width="21px" height="21px" alt={zodiacSign} />
            {t('zodiac_boost', { zodiac: zodiacSign })}
          </StyledLabel>
        ))}
      {(diceCount ?? 0) > 0 && (
        <StyledLabel>
          <img src="/trait-icons/Dice.png" alt="Hell Dice" />
          {t('hell_dice', { diceCount, boost: numberWithSign(epochRarityBoost ?? 0) })}
        </StyledLabel>
      )}
      {themeBoost > 0 && (
        <StyledLabel>
          <img src="/trait-icons/Theme.png" alt="Theme Boost" />
          {t('theme_boost', { boost: themeBoost })}
        </StyledLabel>
      )}
    </StyledContainer>
  )
}
