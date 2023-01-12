import { useMemo } from 'react'
import { GetBscTreasuryMetrics_bscTreasuryMarketValues } from 'graphs/__generated__/GetBscTreasuryMetrics'
import { GetTreasuryMetrics_protocolMetrics } from '../graphs/__generated__/GetTreasuryMetrics'
import { GetAvaxTreasuryMetrics_avaxTreasuryMarketValues } from '../graphs/__generated__/GetAvaxTreasuryMetrics'
import useAvaxTreasuryMarketValues from './useAvaxTreasuryMarketValues'
import useTreasuryMetrics from './useTreasuryMetrics'
import useBscTreasuryMarketValues from './useBscTreasuryMarketValues'

export interface AggregatedMetrics
  extends Omit<GetTreasuryMetrics_protocolMetrics, '__typename'>,
    Omit<GetAvaxTreasuryMetrics_avaxTreasuryMarketValues, '__typename'>,
    Omit<GetBscTreasuryMetrics_bscTreasuryMarketValues, '__typename'> {}

export default function useCrossChainTreasuryMetrics(): {
  loading: boolean
  metrics: AggregatedMetrics[]
  latestMetrics?: AggregatedMetrics
} {
  const { loading, metrics } = useTreasuryMetrics()
  const { loading: avaxLoading, metrics: avaxMetrics } = useAvaxTreasuryMarketValues()
  const { loading: bscLoading, metrics: bscMetrics } = useBscTreasuryMarketValues()

  // Aggregate Cross-Chain metrics
  const aggregatedMetrics = useMemo(
    () =>
      metrics?.map(x => {
        const matchAvax = avaxMetrics?.find(a => a.id === x.id)
        const matchBsc = bscMetrics?.find(a => a.id === x.id)

        const tmv =
          parseFloat(x.treasuryMarketValue) +
          parseFloat(matchAvax?.avaxTotalMarketValue ?? '0') +
          parseFloat(matchBsc?.bscTotalMarketValue ?? '0')
        const backingWithoutClam =
          parseFloat(x.treasuryMarketValueWithoutClam) +
          parseFloat(matchAvax?.avaxTotalMarketValue ?? '0') +
          parseFloat(matchBsc?.bscTotalMarketValue ?? '0')

        // TODO: Key settings map?
        return {
          id: x.id,
          treasuryMarketValue: tmv,
          treasuryMarketValueWithoutClam: backingWithoutClam,
          clamBacking: backingWithoutClam / parseInt(x.clamCirculatingSupply, 10),
          // AVAX
          avaxTotalMarketValue: matchAvax?.avaxTotalMarketValue,
          avaxUsdcMarketValue: matchAvax?.avaxUsdcMarketValue,
          avaxWMemoMarketValue: matchAvax?.avaxWMemoMarketValue,
          // BSC
          bscThenaPairBusdUsdcMarketValue: matchBsc?.bscThenaPairBusdUsdcMarketValue,
          bscTotalMarketValue: matchBsc?.bscTotalMarketValue,
          // POLYGON
          clamCirculatingSupply: x.clamCirculatingSupply,
          clamPrice: x.clamPrice,
          marketCap: x.marketCap,
          timestamp: x.timestamp,
          totalBurnedClam: x.totalBurnedClam,
          totalBurnedClamMarketValue: x.totalBurnedClamMarketValue,
          totalSupply: x.totalSupply,
          treasuryClamMaiMarketValue: x.treasuryClamMaiMarketValue,
          treasuryClamValue: x.treasuryClamValue,
          treasuryDaiMarketValue: x.treasuryDaiMarketValue,
          treasuryDystMarketValue: x.treasuryDystMarketValue,
          treasuryDystopiaPairMaiClamMarketValue: x.treasuryDystopiaPairMaiClamMarketValue,
          treasuryDystopiaPairQiTetuQiMarketValue: x.treasuryDystopiaPairQiTetuQiMarketValue,
          treasuryDystopiaPairUSDPLUSClamMarketValue: x.treasuryDystopiaPairUSDPLUSClamMarketValue,
          treasuryDystopiaPairUsdcClamMarketValue: x.treasuryDystopiaPairUsdcClamMarketValue,
          treasuryDystopiaPairUsdcTusdMarketValue: x.treasuryDystopiaPairUsdcTusdMarketValue,
          treasuryDystopiaPairUsdplusStMaticMarketValue: x.treasuryDystopiaPairUsdplusStMaticMarketValue,
          treasuryDystopiaPairUsdplusUsdcMarketValue: x.treasuryDystopiaPairUsdplusUsdcMarketValue,
          treasuryDystopiaPairwMaticDystMarketValue: x.treasuryDystopiaPairwMaticDystMarketValue,
          treasuryKyberswapMaticStMaticHedgedMarketValue: x.treasuryKyberswapMaticStMaticHedgedMarketValue,
          treasuryMaiStMaticMarketValue: x.treasuryMaiStMaticMarketValue,
          treasuryMaiUsdcQiInvestmentValue: x.treasuryMaiUsdcQiInvestmentValue,
          treasuryOHMStrategyMarketValue: x.treasuryOHMStrategyMarketValue,
          treasuryOtterClamQiMarketValue: x.treasuryOtterClamQiMarketValue,
          treasuryPenDystMarketValue: x.treasuryPenDystMarketValue,
          treasuryPenMarketValue: x.treasuryPenMarketValue,
          treasuryPenroseHedgedMaticMarketValue: x.treasuryPenroseHedgedMaticMarketValue,
          treasuryQiMarketValue: x.treasuryQiMarketValue,
          treasuryQiWmaticMarketValue: x.treasuryQiWmaticMarketValue,
          treasuryQiWmaticQiInvestmentMarketValue: x.treasuryQiWmaticQiInvestmentMarketValue,
          treasuryQuickswapV3MaiUsdtStrategyMarketValue: x.treasuryQuickswapV3MaiUsdtStrategyMarketValue,
          treasurySandMarketValue: x.treasurySandMarketValue,
          treasuryTetuQiMarketValue: x.treasuryTetuQiMarketValue,
          treasuryUniV3HedgedMaticUsdcStrategyMarketValue: x.treasuryUniV3HedgedMaticUsdcStrategyMarketValue,
          treasuryUniV3UsdcMaiStrategyMarketValue: x.treasuryUniV3UsdcMaiStrategyMarketValue,
          treasuryUsdPlusMarketValue: x.treasuryUsdPlusMarketValue,
          treasuryVeDystMarketValue: x.treasuryVeDystMarketValue,
          treasuryVlPenMarketValue: x.treasuryVlPenMarketValue,
          treasuryWMEMOStrategyMarketValue: x.treasuryWMEMOStrategyMarketValue, // now unused
          treasuryWmaticMarketValue: x.treasuryWmaticMarketValue,
          treasuryArrakisUsdcMaiMarketValue: x.treasuryArrakisUsdcMaiMarketValue,
        } as AggregatedMetrics
      }),
    [metrics, avaxMetrics]
  )

  return {
    loading: Boolean(loading || avaxLoading),
    metrics: aggregatedMetrics,
    latestMetrics: aggregatedMetrics[0],
  }
}
