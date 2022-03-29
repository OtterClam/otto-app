/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListMyPortals
// ====================================================

export interface ListMyPortals_ottos {
  __typename: "Otto";
  tokenId: BigInt;
  owner: Bytes;
  tokenURI: string;
}

export interface ListMyPortals {
  ottos: ListMyPortals_ottos[];
}
