import { useQuery } from '@apollo/client'
import { GET_AVAX_TREASURY_MARKET_VALUES } from 'graphs/avax'
import { GetTreasuryMetrics, GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { useAvaxSubgraph } from './useAvaxSubgraph'

export default function useTreasuryMetrics(): {
  loading: boolean
  metrics: GetTreasuryMetrics_protocolMetrics[]
  latestMetrics?: GetTreasuryMetrics_protocolMetrics
} {
  const avaxSubgraph = useAvaxSubgraph()
  const result = useQuery<GetTreasuryMetrics>(GET_AVAX_TREASURY_MARKET_VALUES, { client: avaxSubgraph })
  const metrics = result?.data?.protocolMetrics ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
    latestMetrics: metrics[0],
  }
}
