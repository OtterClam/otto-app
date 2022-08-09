import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { GET_LAST_PAYOUT_TO_ADDRESS } from 'graphs/otter'
import { LastPayout, LastPayout_stakedBalances } from 'graphs/__generated__/LastPayout'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function useLastPayoutToAccount(): {
  loading: boolean
  payout?: LastPayout_stakedBalances
} {
  const otterSubgraph = useOtterSubgraph()
  const { account } = useEthers()
  const result = useQuery<LastPayout>(GET_LAST_PAYOUT_TO_ADDRESS, {
    client: otterSubgraph,
    variables: { address: account?.toLowerCase() || '' },
    skip: !account,
  })
  const payouts = result?.data?.stakedBalances?.[0]

  return {
    loading: Boolean(result?.loading),
    payout: payouts,
  }
}
