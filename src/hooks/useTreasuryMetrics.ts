import { useQuery } from '@apollo/client'
import { GET_TREASURY_METRICS } from 'graphs/otter'
import { GetTreasuryMetrics, GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function useTreasuryMetrics(): {
  loading: boolean
  metrics: GetTreasuryMetrics_protocolMetrics[]
  latestMetrics?: GetTreasuryMetrics_protocolMetrics
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<GetTreasuryMetrics>(GET_TREASURY_METRICS, { client: otterSubgraph })
  const metrics = result?.data?.protocolMetrics ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
    latestMetrics: metrics[0],
  }
}
