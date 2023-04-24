import { AdventurePotion } from 'constant'
import useAdventurePotion from 'hooks/useAdventurePotion'
import useRemainingTime from 'hooks/useRemainingTime'
import useSpeedUpPotionPreview from 'hooks/useSpeedUpPotionPreview'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import SpeedUpPotion from './SpeedUpPotion'

const SpeedPotion = '/images/adventure/speed-up-potion.png'

const StyledSpeedUpPotions = styled.div`
  display: flex;
  gap: 30px;
`

const StyledRemaining = styled(ContentMedium).attrs({ as: 'p' })<{ usedPotions: boolean }>`
  padding: 8px 27px;
  border-radius: 20px;
  background: ${({ theme, usedPotions }) => (usedPotions ? theme.colors.otterBlue : theme.colors.darkGray400)};
`

interface Props {
  disabled: boolean
  targetDate: Date
  potions: Record<string, number>
  onUsedPotionsUpdate: (potions: Record<string, number>) => void
}

export default function SpeedUpPotions({ disabled, targetDate, potions, onUsedPotionsUpdate }: Props) {
  const { t } = useTranslation()
  const { amounts } = useAdventurePotion()
  const usedPotionIds = useMemo(
    () =>
      Object.keys(potions)
        .map(key => {
          const amount = potions[key]
          const idList: number[] = []
          for (let i = 0; i < amount; i += 1) {
            idList.push(Number(key))
          }
          return idList
        })
        .reduce((all, list) => all.concat(list), [] as number[]),
    [potions]
  )
  const previewRemainingTime = useSpeedUpPotionPreview(targetDate, usedPotionIds)
  const remainingDuration = useRemainingTime(previewRemainingTime)

  return (
    <>
      <StyledRemaining usedPotions={usedPotionIds.length > 0}>
        {t('adventure_remaining', { time: remainingDuration })}
      </StyledRemaining>
      <StyledSpeedUpPotions>
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.OneHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={onUsedPotionsUpdate}
          image={SpeedPotion}
          amounts={amounts}
          usedAmounts={potions}
          reducedTime="1h"
        />
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.ThreeHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={onUsedPotionsUpdate}
          image={SpeedPotion}
          amounts={amounts}
          usedAmounts={potions}
          reducedTime="3h"
        />
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.SixHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={onUsedPotionsUpdate}
          image={SpeedPotion}
          amounts={amounts}
          usedAmounts={potions}
          reducedTime="6h"
        />
      </StyledSpeedUpPotions>
    </>
  )
}
