import { ApolloClient } from '@apollo/client'
import { Api } from 'libs/api'
import { ItemsRepository } from './items'
import { OttosRepository } from './ottos'

export class Repositories {
  public readonly items: ItemsRepository

  public readonly ottos: OttosRepository

  public readonly api: Api

  public readonly ottoSubgraph: ApolloClient<object>

  constructor({ api, ottoSubgraph }: { api: Api; ottoSubgraph: ApolloClient<object> }) {
    this.api = api
    this.ottoSubgraph = ottoSubgraph
    this.items = new ItemsRepository(this)
    this.ottos = new OttosRepository(this)
  }
}
