import { ChainId } from '@usedapp/core'
import axios, { Axios } from 'axios'
import { Dice } from 'models/Dice'
import { ForgeFormula, RawForgeFormula, rawForgeToForge } from 'models/Forge'
import Item, { rawItemToItem } from 'models/Item'
import { Notification, RawNotification } from 'models/Notification'
import { OttoMeta } from 'models/Otto'
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
  private otterclamClient: Axios

  constructor(chainId: ChainId) {
    this.otterclamClient = axios.create({
      baseURL: otterclamApiEndpoint[chainId],
    })
  }

  setLanguage(lang: string): void {
    this.otterclamClient.defaults.headers.common['Accept-language'] = lang
  }

  public async getPortalCandidates(portalId: string): Promise<OttoCandidateMeta[]> {
    return this.otterclamClient.get(`/ottos/candidates/metadata/${portalId}`).then(res => res.data)
  }

  public async getOttoMeta(ottoId: string, details: boolean): Promise<OttoMeta> {
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
  ): Promise<OttoMeta[]> {
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
}

export const defaultApi = new Api(ChainId.Polygon)
