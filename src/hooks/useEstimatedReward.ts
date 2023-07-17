import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useMemo } from 'react'
import { trim } from 'helpers/trim'
import Otto from 'models/Otto'

const calcReward = (
  rank: number,
  totalReward: number,
  prizeCount: number,
  reciprocalRewardShift: number,
  isAdventure: boolean,
  ap?: number
) => {
  let sum = 0
  for (let i = 1; i <= prizeCount; i++) {
    sum += 1 / (i + reciprocalRewardShift)
  }
  const topReward = totalReward / sum
  if (isAdventure && ap === 0) {
    return 0
  }
  return rank <= prizeCount ? topReward * (1 / (rank + reciprocalRewardShift)) : 0
}

export default function useEstimatedReward(rank: number, isAdventure: boolean, ap?: number) {
  const { epoch, totalReward, prizeCount, reciprocalRewardShift } = useRarityEpoch()

  return useMemo(
    () => trim(calcReward(rank, totalReward, prizeCount, reciprocalRewardShift, isAdventure, ap), isAdventure ? 0 : 2),
    [rank, prizeCount, reciprocalRewardShift, isAdventure, ap, totalReward]
  )
}

// todo: refactor logic into static function in a non-hook file
export function useEstimatedTotalReward(myOttos: Otto[], isAdventure: boolean) {
  const { epoch, totalReward, prizeCount, reciprocalRewardShift } = useRarityEpoch()

  const estimatedTotalReward = useMemo(() => {
    return trim(
      myOttos.reduce((total, otto) => {
        const rank = isAdventure ? otto.apRanking : otto.ranking
        const reward = calcReward(rank, totalReward, prizeCount, reciprocalRewardShift, isAdventure, otto.ap)
        return total + reward
      }, 0),
      isAdventure ? 0 : 2
    )
  }, [myOttos, prizeCount, isAdventure, totalReward, reciprocalRewardShift])

  return estimatedTotalReward
}
