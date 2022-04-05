require('dotenv').config()

module.exports = {
  client: {
    service: {
      name: 'subgraph',
      // FIXME: change to mainnet before deployed
      url: process.env.REACT_APP_GRAPH_ENDPOINT_MUMBAI,
    },
  },
}
