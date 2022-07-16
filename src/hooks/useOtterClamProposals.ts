import { useQuery } from '@apollo/client'
import { GET_OTTERCLAM_PROPOSALS } from 'graphs/snapshot'
import { OtterClamProposals } from 'graphs/__generated__/OtterClamProposals'
import { Proposal } from '../models/Proposal'
import { useSnapshotSubgraph } from './useSnapshotSubgraph'

export default function useOtterClamProposals(): {
  loading: boolean
  proposals: Proposal[]
} {
  const snapshotSubgraph = useSnapshotSubgraph()
  const result = useQuery<OtterClamProposals>(GET_OTTERCLAM_PROPOSALS, { client: snapshotSubgraph })
  const proposals =
    result?.data?.proposals?.flatMap(x => {
      return {
        id: x?.id,
        title: x?.title,
        body: x?.body,
        choices: x?.choices,
        scores: x?.scores,
        start: x?.start,
        end: x?.end,
        votes: x?.votes,
        space: x?.space?.id,
        snapshot: x?.snapshot,
        type: x?.type,
        state: x?.state,
      } as Proposal
    }) ?? []

  return {
    loading: Boolean(result?.loading),
    proposals,
  }
}
