import { gql } from '@apollo/client'

export const GET_AVAX_TREASURY_MARKET_VALUES = gql`
  query GetAvaxTreasuryMetrics {
    avaxTreasuryMarketValues(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      avaxTotalMarketValue
      avaxUsdcMarketValue
      avaxWMemoMarketValue
    }
  }
`
