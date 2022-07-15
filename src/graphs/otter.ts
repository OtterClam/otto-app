import { gql } from '@apollo/client'

export const GET_PEARL_BANK_METRICS = gql`
  query GetPearlBankMetrics {
    pearlBankMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      payoutMatketValue
      cumulativeRewardPayoutMarketValue
      apr
      clamMarketValueWhenPayoutHappens
      clamPondDepositedAmount
      stakedCLAMAmount
      clamTotalSupply
      timestamp
    }
  }
`

export const GET_TREASURY_METRICS = gql`
  query GetTreasuryMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      clamCirculatingSupply
      sClamCirculatingSupply
      totalSupply
      clamPrice
      marketCap
      totalValueLocked
      treasuryMarketValue
      nextEpochRebase
      nextDistributedClam
      treasuryMaiMarketValue
      treasuryFraxMarketValue
      treasuryWmaticMarketValue
      treasuryMaiUsdcRiskFreeValue
      treasuryMaiUsdcQiInvestmentRiskFreeValue
      treasuryQiMarketValue
      treasuryDquickMarketValue
      treasuryQiWmaticMarketValue
      treasuryQiWmaticQiInvestmentMarketValue
      treasuryDaiRiskFreeValue
      treasuryClamMaiPOL
      treasuryOtterClamQiMarketValue
      treasuryTetuQiMarketValue
      treasuryVeDystMarketValue
      treasuryDystMarketValue
      treasuryDystopiaPairMaiClamMarketValue
      treasuryDystopiaPairUSDPLUSClamMarketValue
      treasuryDystopiaPairwMaticDystMarketValue
      treasuryDystopiaPairMaiUsdcMarketValue
      treasuryDystopiaPairFraxUsdcMarketValue
      treasuryVlPenMarketValue
      treasuryPenDystMarketValue
      treasuryPenMarketValue
      totalBurnedClam
      totalBurnedClamMarketValue
    }
  }
`

export const GET_TREASURY_REVENUE = gql`
  query GetTreasuryRevenue {
    treasuryRevenues(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      ottopiaClamAmount
      ottopiaMarketValue
      yieldClamAmount
      yieldMarketValue
      totalRevenueClamAmount
      totalRevenueMarketValue
      buybackClamAmount
      buybackMarketValue
      cumulativeBuybackClamAmount
      cumulativeBuybackMarketValue
      qiClamAmount
      qiMarketValue
      dystClamAmount
      dystMarketValue
      penClamAmount
      penMarketValue
    }
  }
`
