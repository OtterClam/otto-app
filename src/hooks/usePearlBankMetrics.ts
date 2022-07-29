import { useQuery } from '@apollo/client'
import { GET_PEARL_BANK_METRICS } from 'graphs/otter'
import { GetPearlBankMetrics, GetPearlBankMetrics_pearlBankMetrics } from 'graphs/__generated__/GetPearlBankMetrics'
import { useMemo } from 'react'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function usePearlBankMetrics(): {
  loading: boolean
  metrics: GetPearlBankMetrics_pearlBankMetrics[]
  latestMetrics?: GetPearlBankMetrics_pearlBankMetrics
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<GetPearlBankMetrics>(GET_PEARL_BANK_METRICS, { client: otterSubgraph })
  const metrics = result?.data?.pearlBankMetrics ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
    latestMetrics: metrics[0],
  }
}
