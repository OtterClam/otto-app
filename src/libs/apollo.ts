import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apollo = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_ENDPOINT,
  cache: new InMemoryCache(),
})
