import { gql, useQuery } from '@apollo/client'
import { useOttoInfo } from 'contracts/views'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetEpoch, GetEpochVariables } from './__generated__/GetEpoch'

const START_DATE = new Date('2022-05-23').valueOf()
const EPOCH_LENGTH = 14 * 86400 * 1000 // 14 days

const GET_EPOCH = gql`
  query GetEpoch($epoch: Int!) {
    epoches(where: { num: $epoch }) {
      totalOttos
    }
  }
`

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
  const epochEnd = START_DATE + ((isLatestEpoch ? latestEpoch : epoch) + 1) * EPOCH_LENGTH
  const hasPrevEpoch = (epoch === -1 || epoch > 0) && latestEpoch > 0
  const hasNextEpoch = epoch !== -1
  const totalOttoSupply = epoch === -1 ? totalSupply - 250 : data?.epoches[0].totalOttos ?? 0

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
