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

// todo: prep for cache?
function aggregateInvestments(investments: Investments_investments[]) {
  let aggInvestments: { [id: string]: Investments_investments[] } = {}
  for (let inv of investments) {
    //unique by protocol+strategy key pair
    let id = `${inv.protocol + inv.strategy}`
    if (!(id in aggInvestments)) {
      aggInvestments[id] = [inv]
    } else {
      aggInvestments[id].push(inv)
      ///aaaaaah what do with timestamps
      //change whole thing to arrays and push?
      // yeah that's kinda nice because "avg last 7 days" would break when investment changes
    }
  }

  for (let id of aggInvestments.keys()) {
  }
}
