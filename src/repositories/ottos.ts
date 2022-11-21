import { Api } from 'libs/api'
import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'
import { AdventureLocation } from 'models/AdventureLocation'
import { ItemAction, ItemMetadata } from 'models/Item'
import Otto, { RawOtto } from 'models/Otto'
import type { Repositories } from 'repositories'
import { ItemsRepository } from './items'

export class OttosRepository {
  private readonly api: Api

  private readonly items: ItemsRepository

  constructor(private readonly root: Repositories, private readonly abortSignal?: AbortSignal) {
    this.api = root.api
    this.items = root.items.withAbortSignal(abortSignal)
  }

  private get graphContext() {
    if (!this.abortSignal) {
      return
    }
    return {
      fetchOptions: {
        signal: this.abortSignal,
      },
    }
  }

  withAbortSignal(abortSignal?: AbortSignal) {
    return new OttosRepository(this.root, abortSignal)
  }

  private async fromOttoMetadata(ottoMetadata: RawOtto, preview?: boolean): Promise<Otto> {
    const nativeTokenIds = (ottoMetadata.otto_native_traits ?? []).map(({ id }) => id)
    const itemTokenIds = (ottoMetadata.otto_details ?? []).map(({ id }) => id)
    // eslint-disable-next-line prefer-const
    let [allItemsMetadata, equippedItems, previewItemsMetadata] = await Promise.all([
      this.items.getMetadata(itemTokenIds.concat(nativeTokenIds)),
      this.items.getItemsByOttoTokenId(ottoMetadata.id),
      preview
        ? this.items.getMetadata(
            ottoMetadata.otto_details?.filter(({ wearable }) => wearable).map(({ id }) => id) ?? []
          )
        : undefined,
    ])
    const itemsMetadata = itemTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])
    const nativeItemsMetadata = nativeTokenIds.map(itemTokenId => allItemsMetadata[itemTokenId])

    if (previewItemsMetadata) {
      // delete removed items
      equippedItems = equippedItems.filter(item => {
        if (!previewItemsMetadata) {
          return false
        }
        const exist = Object.prototype.hasOwnProperty.call(previewItemsMetadata, item.metadata.tokenId)
        if (exist) {
          delete previewItemsMetadata[item.metadata.tokenId]
        }
        return exist
      })

      // equipped itmes
      equippedItems = equippedItems.concat(
        Object.values(previewItemsMetadata)
          .filter(metadata => !nativeTokenIds.includes(metadata.tokenId))
          .map(metadata => ({
            id: `draft_${metadata.tokenId}`,
            amount: 1,
            equippedBy: ottoMetadata.id,
            unreturnable: false,
            updatedAt: new Date(),
            metadata,
          }))
      )
    }

    return new Otto(ottoMetadata, equippedItems, nativeItemsMetadata, itemsMetadata)
  }

  async getOtto(tokenId: string): Promise<Otto | null> {
    const ottoMetadata = await this.api.getOttoMeta(tokenId, true, this.abortSignal)
    return this.fromOttoMetadata(ottoMetadata)
  }

  // the response won't contains items formation
  async getOttosByTokenIds(tokenIds: string[], epoch = -1): Promise<Otto[]> {
    const ottos = await this.api.getOttoMetas(tokenIds, { details: true, epoch })
    return ottos.map(raw => new Otto(raw))
  }

  async getOttosByAccount(account: string): Promise<Otto[]> {
    const ottos = await this.api.getAdventureOttos(account, this.abortSignal)
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
    locationId: number | undefined,
    actions: ItemAction[] = []
  ): Promise<{ otto: Otto; location?: AdventureLocation }> {
    const preview = await this.api.getOttoAdventurePreview(ottoTokenId, locationId, actions, this.abortSignal)
    const otto = await this.fromOttoMetadata(preview, true)
    return {
      otto,
      location: preview.location,
    }
  }
}
