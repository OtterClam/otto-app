import { AdventurePotion } from 'constant'
import useAdventurePotion from 'hooks/useAdventurePotion'
import useRemainingTime from 'hooks/useRemainingTime'
import useSeedUpPotionPreview from 'hooks/useSeedUpPotionPreview'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import SpeedPotion from './speed-up-potion.png'
import SpeedUpPotion from './SpeedUpPotion'

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
  onUsedPotionsUpdate: (numbers: number[]) => void
}

export default function SpeedUpPotions({ disabled, targetDate, onUsedPotionsUpdate }: Props) {
  const { t } = useTranslation()
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const { amounts } = useAdventurePotion()
  const usedPotions = useMemo(
    () =>
      Object.keys(usedPotionAmounts)
        .map(key => {
          const amount = usedPotionAmounts[key]
          const idList: number[] = []
          for (let i = 0; i < amount; i += 1) {
            idList.push(Number(key))
          }
          return idList
        })
        .reduce((all, list) => all.concat(list), [] as number[]),
    [usedPotionAmounts]
  )
  const previewRemainingTime = useSeedUpPotionPreview(targetDate, usedPotions)
  const remainingDuration = useRemainingTime(previewRemainingTime)

  useEffect(() => {
    onUsedPotionsUpdate(usedPotions)
  }, [usedPotions])

  return (
    <>
      <StyledRemaining usedPotions={usedPotions.length > 0}>
        {t('adventure_remaining', { time: remainingDuration })}
      </StyledRemaining>
      <StyledSpeedUpPotions>
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.OneHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={setUsedPotionAmounts}
          image={SpeedPotion.src}
          amounts={amounts}
          usedAmounts={usedPotionAmounts}
          reducedTime="1h"
        />
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.ThreeHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={setUsedPotionAmounts}
          image={SpeedPotion.src}
          amounts={amounts}
          usedAmounts={usedPotionAmounts}
          reducedTime="3h"
        />
        <SpeedUpPotion
          disabled={disabled}
          potion={AdventurePotion.SixHourSpeedy}
          targetDate={previewRemainingTime}
          onChanged={setUsedPotionAmounts}
          image={SpeedPotion.src}
          amounts={amounts}
          usedAmounts={usedPotionAmounts}
          reducedTime="6h"
        />
      </StyledSpeedUpPotions>
    </>
  )
}
