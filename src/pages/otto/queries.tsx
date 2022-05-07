import { gql } from '@apollo/client'

export const GET_OTTO = gql`
  query GetOtto($ottoId: BigInt!) {
    ottos(where: { tokenId: $ottoId }) {
      tokenId
      tokenURI
      mintAt
      legendary
      brs
      rrs
      rarityScore
    }
  }
`
