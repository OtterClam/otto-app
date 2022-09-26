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
  treasuryMarketValue: any;
  treasuryMarketValueWithoutClam: any;
  totalClamUsdPlusRebaseValue: any;
  treasuryWmaticMarketValue: any;
  treasuryDystMarketValue: any;
  treasuryVeDystMarketValue: any;
  treasuryPenDystMarketValue: any;
  treasuryPenMarketValue: any;
  treasuryVlPenMarketValue: any;
  treasuryTetuQiMarketValue: any;
  treasuryQiMarketValue: any;
  treasuryOtterClamQiMarketValue: any;
  treasuryDaiMarketValue: any;
  treasuryUsdPlusMarketValue: any;
  treasuryClamMaiMarketValue: any;
  treasuryMaiUsdcMarketValue: any;
  treasuryMaiUsdcQiInvestmentValue: any;
  treasuryQiWmaticMarketValue: any;
  treasuryMaiStMaticMarketValue: any;
  treasuryQiWmaticQiInvestmentMarketValue: any;
  treasuryDystopiaPairUSDPLUSClamMarketValue: any;
  treasuryDystopiaPairMaiClamMarketValue: any;
  treasuryDystopiaPairwMaticDystMarketValue: any;
  treasuryDystopiaPairQiTetuQiMarketValue: any;
  treasuryDystopiaPairUsdcTusdMarketValue: any;
  treasuryDystopiaPairUsdplusUsdcMarketValue: any;
  treasuryDystopiaPairUsdplusStMaticMarketValue: any;
  treasuryPenroseHedgedMaticMarketValue: any;
  treasuryKyberswapMaticStMaticHedgedMarketValue: any;
  treasuryUniV3UsdcMaiStrategyMarketValue: any;
}

export interface GetTreasuryMetrics {
  protocolMetrics: GetTreasuryMetrics_protocolMetrics[];
}
