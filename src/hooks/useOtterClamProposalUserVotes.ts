import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { GET_OTTERCLAM_USER_VOTED_PROPOSALS } from 'graphs/snapshot'
import { OtterClamUserVotes } from 'graphs/__generated__/OtterClamUserVotes'
import { Proposal } from '../models/Proposal'
import { useSnapshotSubgraph } from './useSnapshotSubgraph'

export default function useOtterClamProposalUserVotes(): {
  loading: boolean
  proposals: Proposal[]
} {
  const snapshotSubgraph = useSnapshotSubgraph()
  const { account } = useEthers()
  const result = useQuery<OtterClamUserVotes>(GET_OTTERCLAM_USER_VOTED_PROPOSALS, {
    client: snapshotSubgraph,
    variables: { address: account?.toLowerCase() || '' },
    skip: !account,
  })

  const proposals =
    result?.data?.votes?.flatMap(x => {
      return {
        id: x?.proposal?.id,
        title: x?.proposal?.title,
        body: x?.proposal?.body,
        choices: x?.proposal?.choices,
        scores: x?.proposal?.scores,
        start: x?.proposal?.start,
        end: x?.proposal?.end,
        votes: x?.proposal?.votes,
        space: x?.proposal?.space?.id,
        snapshot: x?.proposal?.snapshot,
        type: x?.proposal?.type,
        state: x?.proposal?.state,
        // vote allocation
        vote_power: x?.vp,
        voted_choices: x?.choice,
        voted: true,
        vote_power_by_strategy: x?.vp_by_strategy,
      } as Proposal
    }) ?? []

  return {
    loading: Boolean(result?.loading),
    proposals,
  }
}
