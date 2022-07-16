import { useQuery } from '@apollo/client'
import { GET_QIDAO_VOTED_PROPOSALS } from 'graphs/snapshot'
import { QiDaoVotes } from 'graphs/__generated__/QiDaoVotes'
import { Proposal } from '../models/Proposal'
import { useSnapshotSubgraph } from './useSnapshotSubgraph'

export default function useQiDaoProposals(): {
  loading: boolean
  proposals: Proposal[]
} {
  const snapshotSubgraph = useSnapshotSubgraph()
  const result = useQuery<QiDaoVotes>(GET_QIDAO_VOTED_PROPOSALS, { client: snapshotSubgraph })

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
        //DAO vote allocation
        vote_power: x?.vp,
        voted_choices: x?.choice,
        voted: true,
      } as Proposal
    }) ?? []

  return {
    loading: Boolean(result?.loading),
    proposals,
  }
}
