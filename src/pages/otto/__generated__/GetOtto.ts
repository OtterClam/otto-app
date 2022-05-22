/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOtto
// ====================================================

export interface GetOtto_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  mintAt: any;
  legendary: boolean;
  brs: number;
  rrs: number;
  rarityScore: number;
  epoch: number;
  constellationBoost: number;
  legendaryBoost: number;
}

export interface GetOtto {
  ottos: GetOtto_ottos[];
}

export interface GetOttoVariables {
  ottoId: any;
}
