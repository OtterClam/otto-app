import useQueryString from 'hooks/useQueryString'
import { useEffect, useMemo, useState } from 'react'

const START_DATE = new Date('2022-05-23').valueOf()
const EPOCH_LENGTH = 14 * 86400 * 1000 // 14 days

export default function useRarityEpoch() {
  const epoch = Number(useQueryString().get('epoch') || -1)
  const [now, setNow] = useState(Date.now())
  const latestEpoch = useMemo(() => Math.floor((now - START_DATE) / EPOCH_LENGTH), [now])
  const epochEnd = START_DATE + (latestEpoch + 1) * EPOCH_LENGTH
  const isLatestEpoch = epoch === -1 || epoch === latestEpoch
  const hasPrevEpoch = (epoch === -1 || epoch > 0) && latestEpoch > 0
  const hasNextEpoch = epoch !== -1
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
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
  }
}
