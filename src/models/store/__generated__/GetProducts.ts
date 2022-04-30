/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProducts
// ====================================================

export interface GetProducts_ottoProducts {
  __typename: "OttoProduct";
  productId: any;
  type: string;
  amount: number;
  price: any;
  discountPrice: any;
  factory: any;
}

export interface GetProducts {
  ottoProducts: GetProducts_ottoProducts[];
}
