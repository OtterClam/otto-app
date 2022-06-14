/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListRankedOttos
// ====================================================

export interface ListRankedOttos_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  mintAt: any;
  legendary: boolean;
  brs: number;
  rrs: number;
  rarityScore: number;
  constellationBoost: number;
  epochRarityBoost: number;
  diceCount: number;
}

export interface ListRankedOttos {
  ottos: ListRankedOttos_ottos[];
}

export interface ListRankedOttosVariables {
  epoch: number;
  first: number;
  skip: number;
}
