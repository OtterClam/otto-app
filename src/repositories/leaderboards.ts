import { ApolloClient } from '@apollo/client'
import { LIST_ADVENTURE_RANKED_OTTOS, LIST_RANKED_OTTOS } from 'graphs/otto'
import { ListItems, ListItemsVariables } from 'graphs/__generated__/ListItems'
import { ListOttoItems, ListOttoItemsVariables } from 'graphs/__generated__/ListOttoItems'
import { ListRankedOttos, ListRankedOttosVariables } from 'graphs/__generated__/ListRankedOttos'
import { Api } from 'libs/api'
import { ItemMetadata, Item } from 'models/Item'
import { Leaderboard, LeaderboardType } from 'models/Leaderboard'
import type { Repositories } from 'repositories'
import type { OttosRepository } from './ottos'

export class LeaderboardsRepository {
  private api: Api

  private ottoSubgraph: ApolloClient<object>

  private ottos: OttosRepository

  constructor({ api, ottos, ottoSubgraph }: Repositories) {
    this.api = api
    this.ottoSubgraph = ottoSubgraph
    this.ottos = ottos
  }

  async get({
    type,
    page = 0,
    epoch = -1,
    itemsPerPage = 20,
  }: {
    type: LeaderboardType
    page?: number
    epoch?: number
    itemsPerPage?: number
  }): Promise<Leaderboard> {
    const query = {
      [LeaderboardType.RarityScore]: LIST_RANKED_OTTOS,
      [LeaderboardType.AdventurePoint]: LIST_ADVENTURE_RANKED_OTTOS,
    }[type]

    const result = await this.ottoSubgraph.query<ListRankedOttos, ListRankedOttosVariables>({
      query,
      variables: {
        skip: page * itemsPerPage,
        first: itemsPerPage,
        epoch,
      },
    })

    const ottoTokenIds = result.data.ottos.map(({ tokenId }) => tokenId)
    const ottos = await this.ottos.getOttosByTokenIds(ottoTokenIds, epoch)
    // For otters with dice, use the helldice endpoint to get a more up to date view
    if (epoch === -1) {
      await Promise.all(
        ottos.map(async otto => {
          if (otto.diceCount) {
            const diceResults = await this.api.getAllDice(otto.id)
            otto.diceCount = diceResults.length
            const adjustedBrs = diceResults.reduce(
              (prev, current) => prev + (current.events[0]?.effects?.brs ?? 0) + (current.events[1]?.effects?.brs ?? 0),
              0
            )
            otto.totalRarityScore = (
              Number(otto.totalRarityScore) -
              (otto.epochRarityBoost ?? 0) +
              adjustedBrs
            ).toString()
            otto.epochRarityBoost = adjustedBrs
          }
        })
      )
    }
    return {
      type,
      epoch,
      page: {
        page,
        itemsPerPage,
        data: ottos,
      },
    }
  }
}
