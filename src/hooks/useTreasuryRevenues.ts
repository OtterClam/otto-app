import { useQuery } from '@apollo/client'
import { GET_TREASURY_REVENUE } from 'graphs/otter'
import { GetTreasuryRevenue, GetTreasuryRevenue_treasuryRevenues } from 'graphs/__generated__/GetTreasuryRevenue'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function useTreasuryRevenues(): {
  loading: boolean
  revenues: GetTreasuryRevenue_treasuryRevenues[]
  latestRevenues?: GetTreasuryRevenue_treasuryRevenues
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<GetTreasuryRevenue>(GET_TREASURY_REVENUE, { client: otterSubgraph })
  const revenues = result?.data?.treasuryRevenues ?? []

  return {
    loading: Boolean(result?.loading),
    revenues,
    latestRevenues: revenues[0],
  }
}
