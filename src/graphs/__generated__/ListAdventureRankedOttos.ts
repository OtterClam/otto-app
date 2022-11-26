/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListAdventureRankedOttos
// ====================================================

export interface ListAdventureRankedOttos_ottos {
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

export interface ListAdventureRankedOttos {
  ottos: ListAdventureRankedOttos_ottos[];
}

export interface ListAdventureRankedOttosVariables {
  epoch: number;
  first: number;
  skip: number;
}
