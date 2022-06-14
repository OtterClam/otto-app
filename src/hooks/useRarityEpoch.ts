import { useOttoInfo } from 'contracts/views'
import useQueryString from 'hooks/useQueryString'
import { useEffect, useMemo, useRef, useState } from 'react'

const START_DATE = new Date('2022-05-23').valueOf()
const EPOCH_LENGTH = 14 * 86400 * 1000 // 14 days

const epochSupply = [1699]

export default function useRarityEpoch() {
  const epoch = Number(useQueryString().get('epoch') || -1)
  const [latestEpoch, setLatestEpoch] = useState(epoch)
  const [totalSupply] = useOttoInfo()

  const epochEnd = START_DATE + (latestEpoch + 1) * EPOCH_LENGTH
  const isLatestEpoch = epoch === -1 || epoch === latestEpoch
  const hasPrevEpoch = (epoch === -1 || epoch > 0) && latestEpoch > 0
  const hasNextEpoch = epoch !== -1
  const totalOttoSupply = epoch === -1 ? totalSupply : epochSupply[0]

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const latestEpoch = Math.floor((now - START_DATE) / EPOCH_LENGTH)
      setLatestEpoch(latestEpoch)
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
