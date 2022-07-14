import { gql } from '@apollo/client'

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

export const GET_GOVERNANCE_METRICS = gql`
  query GetGovernanceMetrics {
    governanceMetrics(orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      qiDaoVeDystAmt
      dystTotalSupply
      veDystTotalSupply
      penDystTotalSupply
      vlPenTotalSupply
      otterClamVlPenTotalOwned
      otterClamVlPenPercentOwned
      otterClamVeDystPercentOwned
      totalQiBribeRewardsMarketValue
    }
  }
`

export const GET_PENROSE_VOTES = gql`
  query GetGovernanceMetrics {
    votePosition(id: "1") {
      votes {
        id
        timestamp
        vote
      }
    }
  }
`
