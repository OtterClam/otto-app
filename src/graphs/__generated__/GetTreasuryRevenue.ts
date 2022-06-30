/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTreasuryRevenue
// ====================================================

export interface GetTreasuryRevenue_treasuryRevenues {
  __typename: "TreasuryRevenue";
  id: string;
  timestamp: any;
  ottopiaClamAmount: any;
  ottopiaMarketValue: any;
  yieldClamAmount: any;
  yieldMarketValue: any;
  totalRevenueClamAmount: any;
  totalRevenueMarketValue: any;
  buybackClamAmount: any;
  buybackMarketValue: any;
  cumulativeBuybackClamAmount: any;
  cumulativeBuybackMarketValue: any;
  qiClamAmount: any;
  qiMarketValue: any;
  dystClamAmount: any;
  dystMarketValue: any;
  penClamAmount: any;
  penMarketValue: any;
}

export interface GetTreasuryRevenue {
  treasuryRevenues: GetTreasuryRevenue_treasuryRevenues[];
}
