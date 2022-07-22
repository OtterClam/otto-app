/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTreasuryMetrics
// ====================================================

export interface GetTreasuryMetrics_protocolMetrics {
  __typename: "ProtocolMetric";
  id: string;
  timestamp: any;
  clamPrice: any;
  clamCirculatingSupply: any;
  totalSupply: any;
  clamBacking: any;
  marketCap: any;
  totalBurnedClam: any;
  totalBurnedClamMarketValue: any;
  treasuryWmaticMarketValue: any;
  treasuryDystMarketValue: any;
  treasuryVeDystMarketValue: any;
  treasuryPenDystMarketValue: any;
  treasuryPenMarketValue: any;
  treasuryVlPenMarketValue: any;
  treasuryTetuQiMarketValue: any;
  treasuryQiMarketValue: any;
  treasuryOtterClamQiMarketValue: any;
  treasuryCurveMai3PoolValue: any;
  treasuryCurveMai3PoolInvestmentValue: any;
  treasuryMaiUsdcQiInvestmentValue: any;
  treasuryQiWmaticMarketValue: any;
  treasuryQiWmaticQiInvestmentMarketValue: any;
  treasuryDystopiaPairUSDPLUSClamMarketValue: any;
  treasuryDystopiaPairMaiClamMarketValue: any;
  treasuryDystopiaPairwMaticDystMarketValue: any;
  treasuryDystopiaPairQiTetuQiMarketValue: any;
}

export interface GetTreasuryMetrics {
  protocolMetrics: GetTreasuryMetrics_protocolMetrics[];
}
