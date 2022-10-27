/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Investments
// ====================================================

export interface Investments_investments {
  __typename: "Investment";
  id: string;
  protocol: string;
  strategy: string;
  timestamp: any;
  netAssetValue: any;
  grossApr: any;
  grossRevenue: any;
  netApr: any;
  netRevenue: any;
}

export interface Investments {
  investments: Investments_investments[];
}

export interface InvestmentsVariables {
  from?: any | null;
  to?: any | null;
}
