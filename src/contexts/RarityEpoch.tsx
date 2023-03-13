import { useQuery } from '@apollo/client'
import { RARITY_S2_END, RARITY_S2_END_EPOCH, RARITY_S3_START } from 'constant'
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
  const totalOttoSupply = (epoch?.totalOttos ?? 0) - (isAdventure ? 20 : 250)
  const value = useMemo(
    () => ({
      epoch: epochNum,
      epochEndTime,
      isLatestEpoch,
      hasPrevEpoch,
      hasNextEpoch,
      totalOttoSupply,
      constellation: t(`constellation.${epoch?.constellation}`),
      constellationBoost: epoch?.constellationBoost || 50,
    }),
    [epoch, epochEndTime, isLatestEpoch, hasPrevEpoch, hasNextEpoch, totalOttoSupply, epochNum, t]
  )

  return <RarityEpochContext.Provider value={value}>{children}</RarityEpochContext.Provider>
}

export function useRarityEpoch() {
  return useContext(RarityEpochContext)
}
