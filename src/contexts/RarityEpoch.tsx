import { useQuery } from '@apollo/client'
import {
  ROUND_RARITY_REWARD_AFTER_3,
  ROUND_RARITY_REWARD_BEFORE_3,
  ROUND_RARITY_REWARD_S2,
  ROUND_RARITY_REWARD_S2_NEW,
  TOTAL_ADVENTURE_REWARD,
  ROUND_RARITY_REWARD_SEASON_CLAM_FINAL,
  ROUND_RARITY_REWARD_S3_MATIC,
  ROUND_RARITY_REWARD_S3_MATIC_NEW,
  RARITY_S2_END,
  RARITY_S2_END_EPOCH,
  RARITY_S3_START,
  RARITY_S3_MATIC_NEW_START,
} from 'constant'
import { GET_EPOCH } from 'graphs/otto'
import { GetEpoch, GetEpochVariables } from 'graphs/__generated__/GetEpoch'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const RarityEpochContext = createContext({
  epoch: 0,
  epochEndTime: 0,
  isLatestEpoch: false,
  hasPrevEpoch: false,
  hasNextEpoch: false,
  totalOttoSupply: 0,
  totalReward: 0,
  prizeCount: 0,
  reciprocalRewardShift: 0,
  isMatic: false,
  constellation: '',
  constellationBoost: 50,
})

export const RarityEpochProvider = ({ children }: PropsWithChildren<object>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isAdventure = Boolean(router.query.adventure)
  const now = Date.now()
  let epochNum = Number(router.query.epoch || -1)
  if (now > RARITY_S2_END && now < RARITY_S3_START) {
    epochNum = RARITY_S2_END_EPOCH
  }
  const { data } = useQuery<GetEpoch, GetEpochVariables>(GET_EPOCH, {
    variables: { epoch: epochNum },
  })
  const latestEpoch = data?.latestEpoch[0]
  const epoch = data?.epoches[0] || data?.latestEpoch[0]
  let isLatestEpoch = data?.epoches?.length === 0 || epoch?.num === latestEpoch?.num
  if (now > RARITY_S2_END && now < RARITY_S3_START) {
    isLatestEpoch = true
  }
  const epochEndTime = (epoch?.endedAt || 0) * 1000
  const hasPrevEpoch = (epochNum === -1 || epochNum > 0) && (latestEpoch?.num || 0) > 0
  const hasNextEpoch = !isLatestEpoch
  const numIneligibleOtto = isAdventure ? 20 : epochNum === -1 || epochNum >= 18 ? 20 : 250
  const totalOttoSupply = (epoch?.totalOttos ?? 0) - numIneligibleOtto
  const threshold = epochNum >= 17 || epochNum === -1 ? 0.1 : 0.5
  let prizeCount = Math.floor(totalOttoSupply * threshold)
  if (epochNum >= 22 || epochNum === -1) {
    prizeCount = 500
  }
  const reciprocalRewardShift = epochNum >= 22 || epochNum === -1 ? 3 : 0
  const isMatic = epochNum >= 17 || epochNum === -1
  let totalReward =
    epochNum >= 24 || (epochNum === -1 && now > RARITY_S3_MATIC_NEW_START)
      ? ROUND_RARITY_REWARD_S3_MATIC_NEW
      : epochNum >= 17 || epochNum === -1
      ? ROUND_RARITY_REWARD_S3_MATIC
      : epochNum >= 15
      ? ROUND_RARITY_REWARD_SEASON_CLAM_FINAL
      : epochNum >= 12
      ? ROUND_RARITY_REWARD_S2_NEW
      : epochNum >= 6
      ? ROUND_RARITY_REWARD_S2
      : epochNum > 3
      ? ROUND_RARITY_REWARD_AFTER_3
      : ROUND_RARITY_REWARD_BEFORE_3
  if (isAdventure) {
    totalReward = TOTAL_ADVENTURE_REWARD / 4
  }
  const value = useMemo(
    () => ({
      epoch: epochNum,
      epochEndTime,
      isLatestEpoch,
      hasPrevEpoch,
      hasNextEpoch,
      totalOttoSupply,
      totalReward,
      prizeCount,
      reciprocalRewardShift,
      isMatic,
      constellation: t(`constellation.${epoch?.constellation}`),
      constellationBoost: epoch?.constellationBoost || 50,
    }),
    [
      epoch,
      epochEndTime,
      isLatestEpoch,
      hasPrevEpoch,
      hasNextEpoch,
      totalOttoSupply,
      totalReward,
      prizeCount,
      reciprocalRewardShift,
      isMatic,
      epochNum,
      t,
    ]
  )

  return <RarityEpochContext.Provider value={value}>{children}</RarityEpochContext.Provider>
}

export function useRarityEpoch() {
  return useContext(RarityEpochContext)
}
