import { gql } from '@apollo/client'

export const GET_OTTO = gql`
  query GetOtto($ottoId: BigInt!) {
    ottos(where: { tokenId: $ottoId }) {
      tokenId
      tokenURI
      mintAt
      legendary
    }
  }
`

export const LIST_MY_OTTOS = gql`
  query ListMyOttos($owner: Bytes!) {
    ottos(where: { owner: $owner, portalStatus: SUMMONED }, orderBy: tokenId) {
      tokenId
      tokenURI
      mintAt
      legendary
    }
  }
`
