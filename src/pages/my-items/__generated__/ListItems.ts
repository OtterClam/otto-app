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
  owner: any;
  rootOwner: any;
  slot: number;
  tokenId: any;
  tokenURI: string;
  wearable: boolean;
  amount: number;
  parentTokenId: any | null;
}

export interface ListItems {
  ottoItems: ListItems_ottoItems[];
}

export interface ListItemsVariables {
  owner: any;
}
