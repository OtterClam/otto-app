import { gql } from '@apollo/client'

export const GET_PORTAL = gql`
  query GetPortal($portalId: BigInt!) {
    ottos(where: { tokenId: $portalId }) {
      tokenId
      tokenURI
      portalStatus
      canOpenAt
      mintAt
      candidates
      legendary
    }
  }
`
