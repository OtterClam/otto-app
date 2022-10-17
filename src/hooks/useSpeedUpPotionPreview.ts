import { AdventurePotion, AdventureSpeedUpTime } from 'constant'
import { useMemo } from 'react'
import { calcRemainingTime } from 'utils/potion'

export default function useSpeedUpPotionPreview(targetDate: Date, potions: AdventurePotion[]): Date {
  return useMemo(() => {
    return calcRemainingTime(targetDate, potions)
  }, [targetDate, potions])
}
