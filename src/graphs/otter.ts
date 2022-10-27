import { gql } from '@apollo/client'

export const GET_PEARL_BANK_METRICS = gql`
  query GetPearlBankMetrics {
    pearlBankMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      apr
      apy
      rewardRate
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
      treasuryMarketValue
      treasuryMarketValueWithoutClam
      totalClamUsdPlusRebaseValue

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
      treasuryDaiMarketValue
      treasuryUsdPlusMarketValue

      #treasury LPs
      treasuryClamMaiMarketValue
      treasuryMaiUsdcMarketValue
      treasuryMaiUsdcQiInvestmentValue
      treasuryQiWmaticMarketValue
      treasuryMaiStMaticMarketValue
      treasuryQiWmaticQiInvestmentMarketValue
      treasuryDystopiaPairUSDPLUSClamMarketValue
      treasuryDystopiaPairMaiClamMarketValue
      treasuryDystopiaPairwMaticDystMarketValue
      treasuryDystopiaPairQiTetuQiMarketValue
      treasuryDystopiaPairUsdcTusdMarketValue
      treasuryDystopiaPairUsdplusUsdcMarketValue
      treasuryDystopiaPairUsdplusStMaticMarketValue
      treasuryPenroseHedgedMaticMarketValue
      treasuryKyberswapMaticStMaticHedgedMarketValue
      treasuryUniV3HedgedMaticUsdcStrategyMarketValue
      treasuryUniV3UsdcMaiStrategyMarketValue
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
      ldoClamAmount
      ldoMarketValue
      usdPlusClamAmount
      usdPlusMarketValue
      daiClamAmount
      daiMarketValue
      kncClamAmount
      kncMarketValue
      maiClamAmount
      maiMarketValue
      usdcClamAmount
      usdcMarketValue
      maticClamAmount
      maticMarketValue
      totalRevenueClamAmount
      totalRevenueMarketValue
    }
  }
`

export const GET_GOVERNANCE_METRICS = gql`
  query GetGovernanceMetrics {
    governanceMetrics(orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      qiDaoVeDystAmt
      dystMarketCap
      veDystMarketCap
      penDystMarketCap
      vlPenMarketCap
      otterClamVlPenMarketCap
      otterClamVlPenPercentOwned
      otterClamVeDystPercentOwned
    }
  }
`

export const GET_PENROSE_VOTES = gql`
  query GetPenroseVotes {
    votePosition(id: "1") {
      votes {
        id
        timestamp
        vote
      }
    }
  }
`
export const GET_LAST_PAYOUT_TO_ADDRESS = gql`
  query LastPayout($address: ID!) {
    stakedBalances(where: { id: $address }) {
      id
      clamPondLastPayout
      clamPondLastPayoutUsd
      pearlBankLastPayout
    }
  }
`

export const GET_INVESTMENTS = gql`
  query Investments($from: BigInt, $to: BigInt) {
    investments(where: { timestamp_gte: $from, timestamp_lt: $to }, orderBy: timestamp, orderDirection: desc) {
      id
      protocol
      strategy
      timestamp
      netAssetValue
      grossApr
      grossRevenue
      netApr
      netRevenue
      # rewardTokens {
      #   token
      #   amountUsd
      # }
    }
  }
`
