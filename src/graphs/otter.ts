import { gql } from '@apollo/client'

export const GET_PEARL_BANK_METRICS = gql`
  query GetPearlBankMetrics {
    pearlBankMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      apr
      payoutMarketValue
      clamMarketValueWhenPayoutHappens
      cumulativeRewardPayoutMarketValue
      clamPondDepositedClamAmount
      clamPondDepositedUsdValue
      pearlBankDepositedClamAmount
      pearlBankDepositedUsdValue
      totalClamStaked
      totalClamStakedUsdValue
    }
  }
`

export const GET_TREASURY_METRICS = gql`
  query GetTreasuryMetrics {
    protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      #otterclam
      id
      timestamp
      clamPrice
      clamCirculatingSupply
      totalSupply
      clamBacking
      marketCap
      totalBurnedClam
      totalBurnedClamMarketValue

      #treasury tokens
      treasuryWmaticMarketValue
      treasuryDystMarketValue
      treasuryVeDystMarketValue
      treasuryPenDystMarketValue
      treasuryPenMarketValue
      treasuryVlPenMarketValue
      treasuryTetuQiMarketValue
      treasuryQiMarketValue
      treasuryOtterClamQiMarketValue

      #treasury LPs
      treasuryCurveMai3PoolValue
      treasuryCurveMai3PoolInvestmentValue
      treasuryMaiUsdcQiInvestmentValue
      treasuryQiWmaticMarketValue
      treasuryQiWmaticQiInvestmentMarketValue
      treasuryDystopiaPairUSDPLUSClamMarketValue
      treasuryDystopiaPairMaiClamMarketValue
      treasuryDystopiaPairwMaticDystMarketValue
      treasuryDystopiaPairQiTetuQiMarketValue
    }
  }
`

export const GET_TREASURY_REVENUE = gql`
  query GetTreasuryRevenue {
    treasuryRevenues(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      qiClamAmount
      qiMarketValue
      dystClamAmount
      dystMarketValue
      penClamAmount
      penMarketValue
      penDystClamAmount
      penDystMarketValue
      ottopiaClamAmount
      ottopiaMarketValue
      totalRevenueClamAmount
      totalRevenueMarketValue
    }
  }
`
