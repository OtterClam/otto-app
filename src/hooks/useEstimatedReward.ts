import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useMemo } from 'react'
import {
  ROUND_RARITY_REWARD_AFTER_3,
  ROUND_RARITY_REWARD_BEFORE_3,
  ROUND_RARITY_REWARD_S2,
  ROUND_RARITY_REWARD_S2_NEW,
  TOTAL_ADVENTURE_REWARD,
} from 'constant'
import { trim } from 'helpers/trim'
import Otto from 'models/Otto'

const calcTopReward = (prizeCount: number, epoch: number, isAdventure: boolean) => {
  let sum = 0
  let totalReward =
    epoch >= 12 || epoch === -1
      ? ROUND_RARITY_REWARD_S2_NEW
      : epoch >= 6
      ? ROUND_RARITY_REWARD_S2
      : epoch > 3
      ? ROUND_RARITY_REWARD_AFTER_3
      : ROUND_RARITY_REWARD_BEFORE_3
  if (isAdventure) {
    totalReward = TOTAL_ADVENTURE_REWARD / 4
  }
  for (let i = 1; i <= prizeCount; i++) {
    sum += 1 / i
  }
  return totalReward / sum
}

const calcReward = (rank: number, prizeCount: number, epoch: number, isAdventure: boolean) => {
  let sum = 0
  let totalReward =
    epoch >= 12 || epoch === -1
      ? ROUND_RARITY_REWARD_S2_NEW
      : epoch >= 6
      ? ROUND_RARITY_REWARD_S2
      : epoch > 3
      ? ROUND_RARITY_REWARD_AFTER_3
      : ROUND_RARITY_REWARD_BEFORE_3
  if (isAdventure) {
    totalReward = TOTAL_ADVENTURE_REWARD / 4
  }
  for (let i = 1; i <= prizeCount; i++) {
    sum += 1 / i
  }
  const topReward = totalReward / sum
  return rank <= prizeCount ? topReward * (1 / rank) : 0
}

export default function useEstimatedReward(rank: number, isAdventure: boolean) {
  const { epoch, totalOttoSupply } = useRarityEpoch()

  const prizeCount = Math.floor(totalOttoSupply * 0.5)

  return useMemo(
    () => trim(calcReward(rank, prizeCount, epoch, isAdventure), isAdventure ? 0 : 2),
    [rank, prizeCount, epoch, isAdventure]
  )
}

// todo: refactor logic into static function in a non-hook file
export function useEstimatedTotalReward(myOttos: Otto[], isAdventure: boolean) {
  const { epoch, totalOttoSupply } = useRarityEpoch()
  const prizeCount = Math.floor(totalOttoSupply * 0.5)

  const estimatedTotalReward = useMemo(() => {
    return trim(
      myOttos.reduce((total, otto) => {
        const rank = isAdventure ? otto.apRanking : otto.ranking
        const reward = calcReward(rank, prizeCount, epoch, isAdventure)
        return total + reward
      }, 0),
      isAdventure ? 0 : 2
    )
  }, [myOttos, prizeCount, epoch, isAdventure])

  return estimatedTotalReward
}
