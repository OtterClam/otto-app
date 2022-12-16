/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAvaxTreasuryMetrics
// ====================================================

export interface GetAvaxTreasuryMetrics_avaxTreasuryMarketValues {
  __typename: "AvaxTreasuryMarketValue";
  id: string;
  timestamp: any;
  avaxTotalMarketValue: any;
  avaxUsdcMarketValue: any;
  avaxWMemoMarketValue: any;
}

export interface GetAvaxTreasuryMetrics {
  avaxTreasuryMarketValues: GetAvaxTreasuryMetrics_avaxTreasuryMarketValues[];
}
