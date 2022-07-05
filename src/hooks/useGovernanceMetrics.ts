import { useQuery } from '@apollo/client'
import { GET_TREASURY_METRICS } from 'graphs/otter'
import { GetGovernanceMetrics, GetGovernanceMetrics_governanceMetrics } from 'graphs/__generated__/GetGovernanceMetrics'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function useGovernanceMetrics(): {
  loading: boolean
  metrics: GetGovernanceMetrics_governanceMetrics[]
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<GetGovernanceMetrics>(GET_TREASURY_METRICS, { client: otterSubgraph })
  const metrics = result?.data?.governanceMetrics ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
  }
}
