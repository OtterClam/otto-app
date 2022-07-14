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

export const GET_DYSTOPIA_PENROSE_PROPOSALS = gql`
  query DystopiaPenroseProposals {
    proposals(first: 4, skip: 0, where: { space_in: ["dystopia.eth"] }, orderBy: "created", orderDirection: desc) {
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

export const GET_QIDAO_VOTED_PROPOSALS = gql`
  query QiDaoVotes {
    votes(
      first: 10
      where: { space_in: ["qidao.eth"], voter_in: ["0x63b0fb7fe68342afad3d63ef743de4a74cdf462b"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      voter
      choice
      vp
      proposal {
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
        type
      }
    }
  }
`
