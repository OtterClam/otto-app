import { useEthers } from '@usedapp/core'
import { Proposal } from '../models/Proposal'
import useOtterClamProposals from './useOtterClamProposals'
import useOtterClamProposalUserVotes from './useOtterClamProposalUserVotes'

export default function useOtterClamProposalsWithVotes(): {
  loading: boolean
  proposals: Proposal[]
} {
  const { account } = useEthers()
  const { loading: loadingVotes, proposals: votedProposals } = useOtterClamProposalUserVotes()
  const { loading, proposals } = useOtterClamProposals()
  console.log(proposals, votedProposals)

  let finalProposals: Proposal[] = []

  // iterate all OtterClam proposals
  for (let i = 0; i < proposals.length; i++) {
    // check if user voted on this proposal
    let voted = votedProposals.find(x => x.id === proposals[i].id)
    if (voted) {
      // match the vote with the proposal
      finalProposals.push(setMatchedProposalProperties(proposals[i], voted))
    }
    // no user vote, append as-is
    else {
      finalProposals.push(proposals[i])
    }
  }

  return {
    loading: loading && loadingVotes,
    proposals: finalProposals,
  }
}

function setMatchedProposalProperties(proposal: Proposal, votedProposal: Proposal): Proposal {
  proposal.voted = true
  proposal.vote_power = votedProposal.vote_power
  proposal.vote_power_by_strategy = votedProposal.vote_power_by_strategy
  proposal.voted_choices = votedProposal.voted_choices
  return proposal
}
