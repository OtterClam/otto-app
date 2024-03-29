import { gql } from '@apollo/client'

export const GET_OTTERCLAM_PROPOSALS = gql`
  query OtterClamProposals($first: Int!, $skip: Int!) {
    proposals(first: $first, skip: $skip, where: { space: "otterclam.eth" }, orderBy: "created", orderDirection: desc) {
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
    votes(where: { space: "otterclam.eth", voter: $address }, orderBy: "created", orderDirection: desc) {
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
