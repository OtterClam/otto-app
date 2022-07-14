import { useQuery } from '@apollo/client'
import { GET_PENROSE_VOTES } from 'graphs/otter'
import { GetPenroseVotes, GetPenroseVotes_votePosition_votes } from 'graphs/__generated__/GetPenroseVotes'
import { useOtterSubgraph } from './useOtterSubgraph'

export default function usePenroseVotes(): {
  loading: boolean
  votes: GetPenroseVotes_votePosition_votes[]
} {
  const otterSubgraph = useOtterSubgraph()
  const result = useQuery<GetPenroseVotes>(GET_PENROSE_VOTES, { client: otterSubgraph })
  const votes = result?.data?.votePosition?.votes ?? []

  return {
    loading: Boolean(result?.loading),
    votes,
  }
}
