import { ChainId } from '@usedapp/core'
import axios, { Axios } from 'axios'
import { BigNumberish } from 'ethers'
import {
  RawAdventureExploreArgs,
  AdventureLocation,
  RawAdventureLocation,
  rawAdventureLocationToAdventureLocation,
  AdventureExploreArgs,
  AdventureFinishArgs,
} from 'models/AdventureLocation'
import { AdventurePreview, RawAdventurePreview, rawAdventurePreviewToAdventurePreview } from 'models/AdventurePreview'
import { Dice } from 'models/Dice'
import { ForgeFormula, RawForgeFormula, rawForgeToForge } from 'models/Forge'
import Item, { ItemAction, rawItemToItem } from 'models/Item'
import { Notification, RawNotification } from 'models/Notification'
import Otto, { RawOtto } from 'models/Otto'
import Product from 'models/store/Product'

export interface OttoCandidateMeta {
  name: string
  gender: string
  image: string
}

export interface FlashSellResponse {
  type: string
  name: string
  desc: string
  popup_title: string
  popup_desc: string
  popup_image: string
  guarantee_rarity: string
  start_time: number
  end_time: number
  products: Product[]
  special_items: Item[]
  processing_images: string[]
}

const otterclamApiEndpoint: { [key: number]: string } = {
  [ChainId.Polygon]: process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET!,
  [ChainId.Mumbai]: process.env.NEXT_PUBLIC_API_ENDPOINT_MUMBAI!,
}

export class Api {
  private chainId: ChainId

  private otterclamClient: Axios

  constructor(chainId: ChainId) {
    this.chainId = chainId
    this.otterclamClient = axios.create({
      baseURL: otterclamApiEndpoint[chainId],
    })
  }

  withAbortController(abortController: AbortController) {
    const newClient = new Api(this.chainId)
    newClient.otterclamClient.defaults.signal = abortController.signal
    return newClient
  }

  setLanguage(lang: string): void {
    this.otterclamClient.defaults.headers.common['Accept-language'] = lang
  }

  public async getPortalCandidates(portalId: string): Promise<OttoCandidateMeta[]> {
    return this.otterclamClient.get(`/ottos/candidates/metadata/${portalId}`).then(res => res.data)
  }

  public async getOttoMeta(ottoId: string, details: boolean): Promise<RawOtto> {
    return this.otterclamClient.get(`/ottos/metadata/${ottoId}`, { params: { details } }).then(res => res.data)
  }

  public async getNotifications(): Promise<Notification[]> {
    const res = await this.otterclamClient.get<RawNotification[]>('/notifications/home')
    return res.data.map(raw => ({
      key: raw.id,
      imageUrl: raw.image_url,
      text: raw.text,
      url: raw.url,
    }))
  }

  public async getOttoMetas(
    ids: string[],
    { details, epoch }: { details: boolean; epoch?: number }
  ): Promise<RawOtto[]> {
    return this.otterclamClient
      .get(`/ottos/metadata?ids=${ids.join(',')}`, { params: { details, epoch } })
      .then(res => res.data)
  }

  public async getItem(itemId: string): Promise<Item> {
    return this.otterclamClient
      .get(`/items/metadata/${itemId}`)
      .then(res => res.data)
      .then((data: any) => rawItemToItem(itemId, data))
  }

  public async getItems(ids: string[]): Promise<Item[]> {
    return this.otterclamClient
      .get(`/items/metadata?ids=${ids.join(',')}`)
      .then(res => res.data)
      .then((data: any[]) => data.map((d, i) => rawItemToItem(ids[i], d)))
  }

  public async rollTheDice(ottoId: string, tx: string): Promise<Dice> {
    return this.otterclamClient.post(`/ottos/${ottoId}/helldice/${tx}`, null).then(res => new Dice(res.data))
  }

  public async getDice(ottoId: string, tx = ''): Promise<Dice> {
    return this.otterclamClient.get(`/ottos/${ottoId}/helldice/${tx}`).then(res => new Dice(res.data))
  }

  public async getAllDice(ottoId: string): Promise<Dice[]> {
    return this.otterclamClient
      .get(`/ottos/${ottoId}/helldice`)
      .then(res => res.data.map((rawData: any) => new Dice(rawData)))
  }

  public async answerDiceQuestion(ottoId: string, tx: string, index: number, answer: number): Promise<Dice> {
    return this.otterclamClient
      .put(`/ottos/${ottoId}/helldice/${tx}/events/${index}`, { answer })
      .then(res => new Dice(res.data))
  }

  public async getFlashSell(): Promise<FlashSellResponse> {
    return this.otterclamClient.get('/products/flashsale').then(res => ({
      ...res.data,
      start_time: new Date(res.data.start_time).valueOf(),
      end_time: new Date(res.data.end_time).valueOf(),
      special_items: res.data.special_items.map((i: any) => rawItemToItem('', i)),
    }))
  }

  public async getFoundryForges(): Promise<ForgeFormula[]> {
    const result = await this.otterclamClient.get<RawForgeFormula[]>('/foundry/forge')
    return result.data.map(rawForgeToForge)
  }

  public async getAdventureOttos(wallet: string): Promise<Otto[]> {
    const result = await this.otterclamClient.get<RawOtto[]>(`/adventure/wallets/${wallet}`)
    return result.data.map(raw => new Otto(raw))
  }

  public async getOttoAdventurePreview(
    ottoId: string,
    locationId: number,
    actions: ItemAction[]
  ): Promise<AdventurePreview> {
    let url = `/ottos/${ottoId}/adventure/locations/${locationId}/preview`
    if (actions.length) {
      url += `?actions=${JSON.stringify(actions)}`
    }
    const result = await this.otterclamClient.get<RawAdventurePreview>(url)
    return rawAdventurePreviewToAdventurePreview(result.data)
  }

  public async getAdventureLocations(): Promise<AdventureLocation[]> {
    const result = await this.otterclamClient.get<RawAdventureLocation[]>('/adventure/locations')
    return result.data.map(rawAdventureLocationToAdventureLocation)
  }

  public async explore(
    ottoId: string,
    locationId: number,
    wallet: string,
    itemActions: ItemAction[]
  ): Promise<AdventureExploreArgs> {
    const result = await this.otterclamClient.post<RawAdventureExploreArgs>('/adventure/departure', {
      otto_id: Number(ottoId),
      loc_id: locationId,
      wallet,
      actions: itemActions,
    })
    const raw = result.data
    return [
      raw[0],
      raw[1],
      raw[2],
      raw[3].map(([typ, itemId, fromOttoId]: [BigNumberish, BigNumberish, BigNumberish]) => ({
        typ,
        itemId,
        fromOttoId,
      })),
      {
        nonce: raw[4][0],
        digest: raw[4][1],
        signed: raw[4][2],
      },
    ]
  }

  public async finish({
    ottoId,
    wallet,
    immediately,
    potions,
  }: {
    ottoId: string
    wallet: string
    immediately: boolean
    potions: number[]
  }) {
    const result = await this.otterclamClient.post<AdventureFinishArgs>('/adventure/finish', {
      otto_id: ottoId,
      wallet,
      immediately,
      potions,
    })
    return result.data
  }

  public async getAdventureResult(tx: string) {
    const result = await this.otterclamClient.get(`/adventure/results/${tx}`)
    return {
      ...result.data,
      rewards: {
        ...result.data.rewards,
        items: result.data.rewards.items.map((i: any) => rawItemToItem(i.id, i)),
      },
    }
  }
}

export const defaultApi = new Api(ChainId.Polygon)
