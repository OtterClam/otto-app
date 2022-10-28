import { ApolloClient } from '@apollo/client'
import { Api } from 'libs/api'
import flatten from 'lodash/flatten'
import { AdventureLocation } from 'models/AdventureLocation'
import { ItemAction } from 'models/Item'
import Otto, { RawOtto } from 'models/Otto'
import type { Repositories } from 'repositories'
import { ItemsRepository } from './items'

export class OttosRepository {
  private readonly api: Api

  private readonly items: ItemsRepository

  constructor({ api, items }: Repositories) {
    this.api = api
    this.items = items
  }

  private async fromOttoMetadata(ottoMetadata: RawOtto): Promise<Otto> {
    const nativeTokenIds = (ottoMetadata.otto_native_traits ?? []).map(({ id }) => id)
    const itemTokenIds = (ottoMetadata.otto_details ?? []).map(({ id }) => id)
    const [allItemsMetadata, equippedItems] = await Promise.all([
      this.items.getMetadata(itemTokenIds.concat(nativeTokenIds)),
      this.items.getItemsByOttoTokenId(ottoMetadata.id),
    ])
    const itemsMetadata = itemTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])
    const nativeItemsMetadata = nativeTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])
    return new Otto(ottoMetadata, equippedItems, nativeItemsMetadata, itemsMetadata)
  }

  async getOtto(tokenId: string): Promise<Otto | null> {
    const ottoMetadata = await this.api.getOttoMeta(tokenId, true)
    return this.fromOttoMetadata(ottoMetadata)
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

  async previewAdventureOtto(
    ottoTokenId: string,
    locationId: number,
    actions: ItemAction[] = []
  ): Promise<{ otto: Otto; location: AdventureLocation }> {
    const preview = await this.api.getOttoAdventurePreview(ottoTokenId, locationId, actions)
    const otto = await this.fromOttoMetadata(preview)
    return {
      otto,
      location: preview.location,
    }
  }
}
