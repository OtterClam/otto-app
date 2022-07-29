/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGovernanceMetrics
// ====================================================

export interface GetGovernanceMetrics_governanceMetrics {
  __typename: "GovernanceMetric";
  id: string;
  timestamp: any;
  qiDaoVeDystAmt: any;
  dystMarketCap: any;
  veDystMarketCap: any;
  penDystMarketCap: any;
  vlPenMarketCap: any;
  otterClamVlPenMarketCap: any;
  otterClamVlPenPercentOwned: any;
  otterClamVeDystPercentOwned: any;
}

export interface GetGovernanceMetrics {
  governanceMetrics: GetGovernanceMetrics_governanceMetrics[];
}
