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
  timestamp: any;
  apr: any;
  apy: any;
  rewardRate: any;
  payoutMarketValue: any;
  clamMarketValueWhenPayoutHappens: any;
  cumulativeRewardPayoutMarketValue: any;
  clamPondDepositedClamAmount: any;
  clamPondDepositedUsdValue: any;
  pearlBankDepositedClamAmount: any;
  pearlBankDepositedUsdValue: any;
  totalClamStaked: any;
  totalClamStakedUsdValue: any;
}

export interface GetPearlBankMetrics {
  pearlBankMetrics: GetPearlBankMetrics_pearlBankMetrics[];
}
