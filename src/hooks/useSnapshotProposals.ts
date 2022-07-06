import { useQuery } from '@apollo/client'
import { GET_OTTERCLAM_PROPOSALS } from 'graphs/snapshot'
import { OtterClamProposals, OtterClamProposals_proposals } from 'graphs/__generated__/OtterClamProposals'
import { useSnapshotSubgraph } from './useSnapshotSubgraph'

export default function useOtterClamProposals(): {
  loading: boolean
  proposals: OtterClamProposals_proposals[]
} {
  const snapshotSubgraph = useSnapshotSubgraph()
  const result = useQuery<OtterClamProposals>(GET_OTTERCLAM_PROPOSALS, { client: snapshotSubgraph })
  const proposals = result?.data?.proposals?.flatMap(x => x!) ?? []

  return {
    loading: Boolean(result?.loading),
    proposals,
  }
}
