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
  clamCirculatingSupply: any;
  sClamCirculatingSupply: any;
  totalSupply: any;
  clamPrice: any;
  marketCap: any;
  totalValueLocked: any;
  treasuryMarketValue: any;
  nextEpochRebase: any;
  nextDistributedClam: any;
  treasuryMaiMarketValue: any;
  treasuryFraxMarketValue: any;
  treasuryWmaticMarketValue: any;
  treasuryMaiUsdcRiskFreeValue: any;
  treasuryMaiUsdcQiInvestmentRiskFreeValue: any;
  treasuryQiMarketValue: any;
  treasuryDquickMarketValue: any;
  treasuryQiWmaticMarketValue: any;
  treasuryQiWmaticQiInvestmentMarketValue: any;
  treasuryDaiRiskFreeValue: any;
  treasuryClamMaiPOL: any;
  treasuryOtterClamQiMarketValue: any;
  treasuryTetuQiMarketValue: any;
  treasuryVeDystMarketValue: any;
  treasuryDystMarketValue: any;
  treasuryDystopiaPairMaiClamMarketValue: any;
  treasuryDystopiaPairUSDPLUSClamMarketValue: any;
  treasuryDystopiaPairwMaticDystMarketValue: any;
  treasuryDystopiaPairMaiUsdcMarketValue: any;
  treasuryDystopiaPairFraxUsdcMarketValue: any;
  treasuryVlPenMarketValue: any;
  treasuryPenDystMarketValue: any;
  treasuryPenMarketValue: any;
  totalBurnedClam: any;
  totalBurnedClamMarketValue: any;
}

export interface GetTreasuryMetrics {
  protocolMetrics: GetTreasuryMetrics_protocolMetrics[];
}
