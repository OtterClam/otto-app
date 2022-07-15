/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPearlBankMetrics
// ====================================================

export interface GetPearlBankMetrics_pearlBankMetrics {
  __typename: "PearlBankMetric";
  id: string;
  payoutMatketValue: any;
  cumulativeRewardPayoutMarketValue: any;
  /**
   * reward
   */
  apr: any;
  clamMarketValueWhenPayoutHappens: any;
  /**
   * pond
   */
  clamPondDepositedAmount: any;
  /**
   * token supply
   */
  stakedCLAMAmount: any;
  clamTotalSupply: any;
  timestamp: any;
}

export interface GetPearlBankMetrics {
  pearlBankMetrics: GetPearlBankMetrics_pearlBankMetrics[];
}
