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
  dystTotalSupply: any;
  veDystTotalSupply: any;
  penDystTotalSupply: any;
  vlPenTotalSupply: any;
  otterClamVlPenTotalOwned: any;
  otterClamVlPenPercentOwned: any;
  otterClamVeDystPercentOwned: any;
  totalQiBribeRewardsMarketValue: any;
}

export interface GetGovernanceMetrics {
  governanceMetrics: GetGovernanceMetrics_governanceMetrics[];
}
