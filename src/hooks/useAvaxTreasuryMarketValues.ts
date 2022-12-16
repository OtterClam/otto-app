import { useQuery } from '@apollo/client'
import { GET_AVAX_TREASURY_MARKET_VALUES } from 'graphs/avax'
import {
  GetAvaxTreasuryMetrics,
  GetAvaxTreasuryMetrics_avaxTreasuryMarketValues,
} from 'graphs/__generated__/GetAvaxTreasuryMetrics'
import { useAvaxSubgraph } from './useAvaxSubgraph'

export default function useTreasuryMetrics(): {
  loading: boolean
  metrics: GetAvaxTreasuryMetrics_avaxTreasuryMarketValues[]
  latestMetrics?: GetAvaxTreasuryMetrics_avaxTreasuryMarketValues
} {
  const avaxSubgraph = useAvaxSubgraph()
  const result = useQuery<GetAvaxTreasuryMetrics>(GET_AVAX_TREASURY_MARKET_VALUES, { client: avaxSubgraph })
  const metrics = result?.data?.avaxTreasuryMarketValues ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
    latestMetrics: metrics[0],
  }
}
