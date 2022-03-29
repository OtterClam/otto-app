require('dotenv').config()

module.exports = {
  client: {
    service: {
      name: 'subgraph',
      url: process.env.REACT_APP_GRAPH_ENDPOINT,
    },
  },
}
