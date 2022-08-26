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
      type
      space {
        id
      }
    }
  }
`

export const GET_OTTERCLAM_USER_VOTED_PROPOSALS = gql`
  query OtterClamUserVotes($address: String!) {
    votes(
      first: 10
      where: { space_in: ["qidao.eth"], voter_in: [$address] }
      orderBy: "created"
      orderDirection: desc
    ) {
      choice
      vp
      vp_by_strategy
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
        space {
          id
        }
        strategies {
          network
          params
        }
      }
    }
  }
`

// export const GET_DYSTOPIA_PENROSE_PROPOSALS = gql`
//   query DystopiaPenroseProposals {
//     proposals(
//       first: 4
//       skip: 0
//       where: { space_in: ["dystopia.eth", "penrose.eth"], voter_in: ["0x63b0fb7fe68342afad3d63ef743de4a74cdf462b"] }
//       orderBy: "created"
//       orderDirection: desc
//     ) {
//       id
//       title
//       body
//       choices
//       start
//       end
//       snapshot
//       state
//       scores
//       votes
//       type
//       space {
//         id
//       }
//     }
//   }
// `

export const GET_QIDAO_VOTED_PROPOSALS = gql`
  query QiDaoVotes {
    votes(
      first: 10
      where: { space_in: ["qidao.eth"], voter_in: ["0x63b0fb7fe68342afad3d63ef743de4a74cdf462b"] }
      orderBy: "created"
      orderDirection: desc
    ) {
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
        space {
          id
        }
      }
    }
  }
`
