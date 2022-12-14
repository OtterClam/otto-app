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
import Otto from 'models/Otto'

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

// todo: refactor logic into static function in a non-hook file
export function useEstimatedTotalReward(myOttos: Otto[], isAdventure: boolean) {
  const { epoch, totalOttoSupply } = useRarityEpoch()
  const estimatedTotalReward = useMemo(() => {
    return myOttos.reduce((a, b) => {
      const rank = isAdventure ? b.apRanking : b.ranking
      const prizeCount = Math.floor(totalOttoSupply * 0.5)
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
      const topReward = totalReward / sum

      let val = parseFloat(rank <= prizeCount ? trim(topReward * (1 / rank), isAdventure ? 0 : 2) : '-')
      if (val === Infinity || val === -Infinity || !val) val = 0
      return a + val
    }, 0)
  }, [myOttos, isAdventure, epoch])

  return estimatedTotalReward
}
