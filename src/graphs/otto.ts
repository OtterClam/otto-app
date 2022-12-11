import { gql } from '@apollo/client'

export const LIST_ITEMS_BY_OTTO_TOKEN_ID = gql`
  query ListOttoItems($ottoTokenId: BigInt!) {
    ottoItems(where: { parentTokenId: $ottoTokenId, amount_gt: 0 }, first: 1000) {
      id
      tokenId
      amount
      parentTokenId
      updateAt
    }
  }
`

export const LIST_MY_ITEMS = gql`
  query ListItems($owner: Bytes!, $skip: Int!) {
    ottoItems(where: { rootOwner: $owner, amount_gt: 0 }, skip: $skip, first: 1000) {
      id
      tokenId
      amount
      parentTokenId
      updateAt
    }
  }
`

export const GET_EPOCH = gql`
  query GetEpoch($epoch: Int!) {
    epoches(where: { num: $epoch }) {
      num
      totalOttos
      startedAt
      endedAt
      themeLabels
      themeBoostBase
      constellation
      constellationBoost
    }
    latestEpoch: epoches(orderBy: num, orderDirection: desc, first: 1) {
      num
      totalOttos
      startedAt
      endedAt
      themeLabels
      themeBoostBase
      constellation
      constellationBoost
    }
  }
`

export const GET_PRODUCTS = gql`
  query GetProducts {
    ottoProducts {
      productId
      type
      amount
      price
      discountPrice
      factory
    }
  }
`

export const LIST_RANKED_OTTOS = gql`
  query ListRankedOttos($epoch: Int!, $first: Int!, $skip: Int!) {
    ottos(orderBy: rarityScore, orderDirection: desc, first: $first, skip: $skip, where: { epoch: $epoch }) {
      tokenId
      tokenURI
      mintAt
      legendary
      brs
      rrs
      rarityScore
      constellationBoost
      epochRarityBoost
      diceCount
    }
  }
`

export const LIST_ADVENTURE_RANKED_OTTOS = gql`
  query ListAdventureRankedOttos($epoch: Int!, $first: Int!, $skip: Int!) {
    ottos(orderBy: apRank, orderDirection: desc, first: $first, skip: $skip, where: { epoch: $epoch }) {
      tokenId
      tokenURI
      mintAt
      legendary
      brs
      rrs
      rarityScore
      constellationBoost
      epochRarityBoost
      diceCount
    }
  }
`

export const LIST_MY_PORTALS = gql`
  query ListMyPortals($owner: Bytes!) {
    ottos(where: { owner: $owner, portalStatus_not: SUMMONED, epoch: -1 }, orderBy: tokenId) {
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

export const GET_PORTAL = gql`
  query GetPortal($portalId: BigInt!) {
    ottos(where: { tokenId: $portalId, epoch: -1 }) {
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

export const LIST_MY_OTTOS = gql`
  query ListMyOttos($owner: Bytes!) {
    ottos(where: { owner: $owner, portalStatus: SUMMONED, epoch: -1 }, orderBy: tokenId) {
      tokenId
      rarityScore
    }
  }
`
