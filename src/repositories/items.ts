import { ApolloClient } from '@apollo/client'
import { LIST_ITEMS_BY_OTTO_TOKEN_ID, LIST_MY_ITEMS } from 'graphs/otto'
import { ListItems, ListItemsVariables } from 'graphs/__generated__/ListItems'
import { ListOttoItems, ListOttoItemsVariables } from 'graphs/__generated__/ListOttoItems'
import { Api } from 'libs/api'
import { ItemMetadata, Item } from 'models/Item'
import type { Repositories } from 'repositories'

export class ItemsRepository {
  private api: Api

  private ottoSubgraph: ApolloClient<object>

  constructor(private readonly root: Repositories, private readonly abortSignal?: AbortSignal) {
    this.api = root.api
    this.ottoSubgraph = root.ottoSubgraph
  }

  withAbortSignal(abortSignal?: AbortSignal) {
    return new ItemsRepository(this.root, abortSignal)
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

  async getMetadata(tokenIds: string[]): Promise<{ [tokenId: string]: ItemMetadata }> {
    if (!tokenIds.length) {
      return {}
    }
    return this.api.getItemsMetadata(tokenIds, this.abortSignal)
  }

  // this method will not remove duplicated items
  async getMetadataList(tokenIds: string[]): Promise<ItemMetadata[]> {
    const tokenIdToMetadata = await this.getMetadata(tokenIds)
    return tokenIds.map(tokenId => tokenIdToMetadata[tokenId])
  }

  async getItemsByOttoTokenId(ottoTokenId: string): Promise<Item[]> {
    const result = await this.ottoSubgraph.query<ListOttoItems, ListOttoItemsVariables>({
      query: LIST_ITEMS_BY_OTTO_TOKEN_ID,
      variables: {
        ottoTokenId,
      },
      context: this.graphContext,
    })

    const itemsInfo = result.data?.ottoItems ?? []
    const tokenIds = Array.from(new Set(itemsInfo.map(item => String(item.tokenId))))
    const tokenIdToMetadata = await this.getMetadata(tokenIds)

    return itemsInfo.map(info => ({
      id: info.id,
      amount: info.amount,
      equippedBy: info.parentTokenId,
      updatedAt: new Date(Number(info.updateAt) * 1000),
      metadata: tokenIdToMetadata[info.tokenId],
      unreturnable: false,
    }))
  }

  async getAllItemsByAccount(account: string): Promise<Item[]> {
    let items: Item[] = []
    let page = 0
    let hasMoreItems = true

    while (hasMoreItems) {
      const result = await this.getItemsByAccount(account, page)
      items = items.concat(result)
      page += 1
      hasMoreItems = result.length > 0
    }

    return items
  }

  async getItemsByAccount(account: string, page = 0): Promise<Item[]> {
    const itemsPerPage = 1000
    const skip = itemsPerPage * page
    const result = await this.ottoSubgraph.query<ListItems, ListItemsVariables>({
      query: LIST_MY_ITEMS,
      variables: {
        skip,
        owner: account,
      },
    })

    const itemsInfo = result.data?.ottoItems ?? []
    const tokenIds = Array.from(new Set(itemsInfo.map(item => String(item.tokenId))))
    const tokenIdToMetadata = await this.getMetadata(tokenIds)

    return itemsInfo
      .filter(info => {
        if (!Object.prototype.hasOwnProperty.call(tokenIdToMetadata, info.tokenId)) {
          console.warn(`can't find metadata for item #${info.tokenId}`)
          return false
        }
        return true
      })
      .map(info => ({
        id: info.id,
        amount: info.amount,
        equippedBy: info.parentTokenId,
        updatedAt: new Date(Number(info.updateAt) * 1000),
        metadata: tokenIdToMetadata[info.tokenId],
        unreturnable: false,
      }))
  }
}
