import { useQuery } from '@apollo/client'
import { GET_INVESTMENTS } from 'graphs/otter'
import { Investments, Investments_investments } from 'graphs/__generated__/Investments'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function useInvestments(
  fromTimestamp: number,
  toTimestamp: number
): {
  loading: boolean
  investments: Investments_investments[]
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<Investments>(GET_INVESTMENTS, {
    client: otterSubgraph,
    variables: { from: Math.round(fromTimestamp), to: Math.round(toTimestamp) },
  })
  const investments = result?.data?.investments ?? []

  return {
    loading: Boolean(result?.loading),
    investments,
  }
}
