import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useMemo } from 'react'
import {
  ROUND_RARITY_REWARD_AFTER_3,
  ROUND_RARITY_REWARD_BEFORE_3,
  ROUND_RARITY_REWARD_S2,
  TOTAL_ADVENTURE_REWARD,
  TOTAL_RARITY_REWARD,
} from 'constant'
import { trim } from 'helpers/trim'

export default function useEstimatedReward(rank: number, isAdventure: boolean) {
  const { epoch, totalOttoSupply } = useRarityEpoch()

  const prizeCount = Math.floor(totalOttoSupply * 0.5)

  const topReward = useMemo(() => {
    let sum = 0
    let totalReward =
      epoch >= 6
        ? ROUND_RARITY_REWARD_S2
        : epoch > 3 || epoch === -1
        ? ROUND_RARITY_REWARD_AFTER_3
        : ROUND_RARITY_REWARD_BEFORE_3
    if (isAdventure) {
      totalReward = TOTAL_ADVENTURE_REWARD / 4
    }
    for (let i = 1; i <= prizeCount; i++) {
      sum += 1 / i
    }
    return totalReward / sum
  }, [prizeCount, epoch, isAdventure])

  return rank <= prizeCount ? trim(topReward * (1 / rank), isAdventure ? 0 : 2) : '-'
}
