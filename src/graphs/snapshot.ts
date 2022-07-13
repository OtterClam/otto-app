import { gql } from '@apollo/client'

export const GET_OTTERCLAM_PROPOSALS = gql`
  query OtterClamProposals {
    proposals(first: 4, skip: 0, where: { space_in: ["otterclam.eth"] }, orderBy: "created", orderDirection: desc) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      scores
      votes
    }
  }
`
