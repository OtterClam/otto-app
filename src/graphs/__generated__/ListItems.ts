/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListItems
// ====================================================

export interface ListItems_ottoItems {
  __typename: "OttoItem";
  id: string;
  tokenId: any;
  amount: number;
  parentTokenId: any | null;
  updateAt: any;
}

export interface ListItems {
  ottoItems: ListItems_ottoItems[];
}

export interface ListItemsVariables {
  owner: any;
  skip: number;
}
