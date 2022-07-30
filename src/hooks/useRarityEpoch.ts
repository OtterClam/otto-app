import { useQuery } from '@apollo/client'
import { useOttoInfo } from 'contracts/views'
import { GET_EPOCH } from 'graphs/otto'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetEpoch, GetEpochVariables } from 'graphs/__generated__/GetEpoch'

const START_DATE = new Date('2022-05-23').valueOf()
const EPOCH_LENGTH = 14 * 86400 * 1000 // 14 days
const EPOCH_3_EXTEND = 2 * 86400 * 1000 // 2 days

export default function useRarityEpoch() {
  const router = useRouter()
  const epoch = Number(router.query.epoch || -1)
  const [latestEpoch, setLatestEpoch] = useState(epoch)
  const [totalSupply] = useOttoInfo()
  const { data } = useQuery<GetEpoch, GetEpochVariables>(GET_EPOCH, {
    variables: { epoch },
    skip: epoch === -1,
  })

  const isLatestEpoch = epoch === -1 || epoch === latestEpoch
  const currentEpoch = isLatestEpoch ? latestEpoch : epoch
  const epochEnd = START_DATE + (currentEpoch + 1) * EPOCH_LENGTH + (currentEpoch >= 3 ? EPOCH_3_EXTEND : 0)
  const hasPrevEpoch = (epoch === -1 || epoch > 0) && latestEpoch > 0
  const hasNextEpoch = epoch !== -1
  const totalOttoSupply = epoch === -1 ? totalSupply - 250 : data?.epoches[0].totalOttos ?? 0

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      if (now < START_DATE) setLatestEpoch(0)
      else if (now > START_DATE && now < START_DATE + EPOCH_LENGTH * 3)
        setLatestEpoch(Math.floor((now - START_DATE) / EPOCH_LENGTH))
      else if (now < START_DATE + EPOCH_3_EXTEND + 4 * EPOCH_LENGTH) setLatestEpoch(3)
      else setLatestEpoch(Math.floor((now - (START_DATE + 3 * EPOCH_LENGTH + EPOCH_3_EXTEND)) / EPOCH_LENGTH) + 3)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    epoch,
    epochEnd,
    latestEpoch,
    isLatestEpoch,
    hasPrevEpoch,
    hasNextEpoch,
    totalOttoSupply,
  }
}
