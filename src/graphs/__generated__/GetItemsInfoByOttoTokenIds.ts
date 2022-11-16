/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetItemsInfoByOttoTokenIds
// ====================================================

export interface GetItemsInfoByOttoTokenIds_ottoItems {
  __typename: "OttoItem";
  id: string;
  tokenId: any;
  amount: number;
  parentTokenId: any | null;
  updateAt: any;
}

export interface GetItemsInfoByOttoTokenIds {
  ottoItems: GetItemsInfoByOttoTokenIds_ottoItems[];
}

export interface GetItemsInfoByOttoTokenIdsVariables {
  tokenIds: any[];
}
