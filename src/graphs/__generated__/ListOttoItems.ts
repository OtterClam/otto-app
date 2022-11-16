/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListOttoItems
// ====================================================

export interface ListOttoItems_ottoItems {
  __typename: "OttoItem";
  id: string;
  tokenId: any;
  amount: number;
  parentTokenId: any | null;
  updateAt: any;
}

export interface ListOttoItems {
  ottoItems: ListOttoItems_ottoItems[];
}

export interface ListOttoItemsVariables {
  ottoTokenId: any;
}
