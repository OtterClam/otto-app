import { ApolloClient } from '@apollo/client'
import { Api } from 'libs/api'
import { ItemsRepository } from './items'
import { LeaderboardsRepository } from './leaderboards'
import { OttosRepository } from './ottos'

export class Repositories {
  public readonly items: ItemsRepository

  public readonly ottos: OttosRepository

  public readonly leaderboards: LeaderboardsRepository

  public readonly api: Api

  public readonly ottoSubgraph: ApolloClient<object>

  constructor({ api, ottoSubgraph }: { api: Api; ottoSubgraph: ApolloClient<object> }) {
    this.api = api
    this.ottoSubgraph = ottoSubgraph
    this.items = new ItemsRepository(this)
    this.ottos = new OttosRepository(this)
    this.leaderboards = new LeaderboardsRepository(this)
  }
}
