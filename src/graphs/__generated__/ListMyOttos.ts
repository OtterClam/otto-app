/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListMyOttos
// ====================================================

export interface ListMyOttos_ottos {
  __typename: "Otto";
  tokenId: any;
}

export interface ListMyOttos {
  ottos: ListMyOttos_ottos[];
}

export interface ListMyOttosVariables {
  owner: any;
}
