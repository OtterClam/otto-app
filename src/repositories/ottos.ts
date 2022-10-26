import { ApolloClient } from '@apollo/client'
import { Api } from 'libs/api'
import flatten from 'lodash/flatten'
import { ItemMetadata } from 'models/Item'
import Otto from 'models/Otto'
import type { Repositories } from 'repositories'
import { ItemsRepository } from './items'

export class OttosRepository {
  private readonly api: Api

  private readonly ottoSubgraph: ApolloClient<object>

  private readonly items: ItemsRepository

  constructor({ api, ottoSubgraph, items }: Repositories) {
    this.api = api
    this.ottoSubgraph = ottoSubgraph
    this.items = items
  }

  async getOtto(tokenId: string): Promise<Otto | null> {
    const ottoMetadata = await this.api.getOttoMeta(tokenId, true)
    const nativeTokenIds = (ottoMetadata.otto_native_traits ?? []).map(({ id }) => id)
    const itemTokenIds = (ottoMetadata.otto_details ?? []).map(({ id }) => id)
    const [allItemsMetadata, equippedItems] = await Promise.all([
      this.items.getMetadata(itemTokenIds.concat(nativeTokenIds)),
      this.items.getItemsByOttoTokenId(tokenId),
    ])
    const itemsMetadata = itemTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])
    const nativeItemsMetadata = nativeTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])
    return new Otto(ottoMetadata, equippedItems, nativeItemsMetadata, itemsMetadata)
  }

  async getOttosByAccount(account: string): Promise<Otto[]> {
    const ottos = await this.api.getAdventureOttos(account)
    const items = await this.items.getAllItemsByAccount(account)
    const itemsMetadata = await this.items.getMetadata(
      flatten(ottos.map(otto => (otto.otto_native_traits ?? []).concat(otto.otto_details ?? []).map(({ id }) => id)))
    )

    return ottos.map(raw => {
      const nativeItemsMetadata = (raw.otto_native_traits ?? []).map(({ id }) => itemsMetadata[id])
      const equippedItems = items.filter(item => item.equippedBy === raw.id)
      const details = (raw.otto_details ?? []).map(({ id }) => itemsMetadata[id])
      return new Otto(raw, equippedItems, nativeItemsMetadata, details)
    })
  }
}
