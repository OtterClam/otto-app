import { useQuery } from '@apollo/client'
import { GET_BSC_TREASURY_MARKET_VALUES } from 'graphs/bsc'
import {
  GetBscTreasuryMetrics,
  GetBscTreasuryMetrics_bscTreasuryMarketValues,
} from 'graphs/__generated__/GetBscTreasuryMetrics'
import { useBscSubgraph } from './useBscSubgraph'

export default function useBscTreasuryMarketValues(): {
  loading: boolean
  metrics: GetBscTreasuryMetrics_bscTreasuryMarketValues[]
  latestMetrics?: GetBscTreasuryMetrics_bscTreasuryMarketValues
} {
  const bscSubgraph = useBscSubgraph()
  const result = useQuery<GetBscTreasuryMetrics>(GET_BSC_TREASURY_MARKET_VALUES, { client: bscSubgraph })
  const metrics = result?.data?.bscTreasuryMarketValues ?? []

  return {
    loading: Boolean(result?.loading),
    metrics,
    latestMetrics: metrics[0],
  }
}
