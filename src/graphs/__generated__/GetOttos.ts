/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOttos
// ====================================================

export interface GetOttos_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  mintAt: any;
  legendary: boolean;
  brs: number;
  rrs: number;
  rarityScore: number;
}

export interface GetOttos {
  ottos: GetOttos_ottos[];
}

export interface GetOttosVariables {
  tokenIds?: string[] | null;
}
