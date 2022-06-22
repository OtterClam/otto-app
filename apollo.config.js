require('dotenv').config()

module.exports = {
  client: {
    service: {
      name: 'subgraph',
      // FIXME: change to mainnet before deployed
      url: process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MUMBAI,
    },
  },
}
