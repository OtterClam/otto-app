import { gql } from '@apollo/client'

export const GET_BSC_TREASURY_MARKET_VALUES = gql`
  query GetBscTreasuryMetrics {
    bscTreasuryMarketValues(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      bscThenaPairBusdUsdcMarketValue
      bscTotalMarketValue
    }
  }
`
