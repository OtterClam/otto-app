/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBscTreasuryMetrics
// ====================================================

export interface GetBscTreasuryMetrics_bscTreasuryMarketValues {
  __typename: "BscTreasuryMarketValue";
  id: string;
  timestamp: any;
  bscThenaPairBusdUsdcMarketValue: any;
  bscTotalMarketValue: any;
}

export interface GetBscTreasuryMetrics {
  bscTreasuryMarketValues: GetBscTreasuryMetrics_bscTreasuryMarketValues[];
}
