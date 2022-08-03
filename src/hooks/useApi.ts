import { ChainId, useEthers } from '@usedapp/core'
import axios, { Axios } from 'axios'
import { Dice } from 'models/Dice'
import Item from 'models/Item'
import { Notification, RawNotification } from 'models/Notification'
import { OttoMeta } from 'models/Otto'
import Product from 'models/store/Product'
import { useMemo } from 'react'

const hash = (s: string) => {
  return s.split('').reduce((a: number, b: string) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
}

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
  start_time: number
  end_time: number
  products: Product[]
  special_items: Item[]
  processing_images: string[]
}

export class Api {
  private _axios: Axios

  public get axios(): Axios {
    return this._axios
  }

  constructor(axios: Axios) {
    this._axios = axios
  }

  public async getPortalCandidates(portalId: string): Promise<OttoCandidateMeta[]> {
    return this.axios.get(`/ottos/candidates/metadata/${portalId}`).then(res => res.data)
  }

  public async getOttoMeta(ottoId: string, lang: string, details: boolean): Promise<OttoMeta> {
    return this.axios.get(`/ottos/metadata/${ottoId}`, { params: { details, lang } }).then(res => res.data)
  }

  public async getNotifications(): Promise<Notification[]> {
    const res = await this.axios.get<RawNotification[]>('/notifications/home')
    return res.data.map(raw => ({
      key: hash(JSON.stringify(raw)),
      imageUrl: raw.image_url,
      text: raw.text,
      url: raw.url,
    }))
  }

  public async getOttoMetas(
    ids: string[],
    lang: string,
    { details, epoch }: { details: boolean; epoch?: number }
  ): Promise<OttoMeta[]> {
    return this.axios
      .get(`/ottos/metadata?ids=${ids.join(',')}`, { params: { details, lang, epoch } })
      .then(res => res.data)
  }

  public async getItem(itemId: string, lang: string): Promise<Item> {
    return this.axios
      .get(`/items/metadata/${itemId}`, { params: { lang } })
      .then(res => res.data)
      .then((data: any) => this.toItem(itemId, data))
  }

  public async getItems(ids: string[], lang: string): Promise<Item[]> {
    return this.axios
      .get(`/items/metadata?ids=${ids.join(',')}`, { params: { lang } })
      .then(res => res.data)
      .then((data: any[]) => data.map((d, i) => this.toItem(ids[i], d)))
  }

  private toItem(id: string, { name, description, image, details }: any): Item {
    return {
      id,
      name,
      description,
      image,
      equipped: false,
      amount: 1,
      unreturnable: false,
      isCoupon: details.type === 'Coupon',
      total_rarity_score: details.base_rarity_score + details.relative_rarity_score,
      luck: Number(details.stats.find((s: any) => s.name === 'LUK').value) || 0,
      dex: Number(details.stats.find((s: any) => s.name === 'DEX').value) || 0,
      cute: Number(details.stats.find((s: any) => s.name === 'CUTE').value) || 0,
      ...details,
    }
  }

  public async rollTheDice(ottoId: string, tx: string, lang?: string): Promise<Dice> {
    return this.axios
      .post(`/ottos/${ottoId}/helldice/${tx}`, null, { params: { lang } })
      .then(res => new Dice(res.data))
  }

  public async getDice(ottoId: string, tx = '', lang = ''): Promise<Dice> {
    return this.axios.get(`/ottos/${ottoId}/helldice/${tx}`, { params: { lang } }).then(res => new Dice(res.data))
  }

  public async getAllDice(ottoId: string, lang = ''): Promise<Dice[]> {
    return this.axios
      .get(`/ottos/${ottoId}/helldice`, { params: { lang } })
      .then(res => res.data.map((rawData: any) => new Dice(rawData)))
  }

  public async answerDiceQuestion(
    ottoId: string,
    tx: string,
    index: number,
    answer: number,
    lang?: string
  ): Promise<Dice> {
    return this.axios
      .put(`/ottos/${ottoId}/helldice/${tx}/events/${index}`, { answer }, { params: { lang } })
      .then(res => new Dice(res.data))
  }

  public async getFlashSell(lang = ''): Promise<FlashSellResponse> {
    return this.axios.get('/products/flashsale', { params: { lang } }).then(res => ({
      ...res.data,
      start_time: new Date(res.data.start_time).valueOf(),
      end_time: new Date(res.data.end_time).valueOf(),
      special_items: res.data.special_items.map((i: any) => this.toItem('', i)),
    }))
  }
}

export default function useApi() {
  const { chainId } = useEthers()
  let uri = process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    uri = process.env.NEXT_PUBLIC_API_ENDPOINT_MUMBAI
  }
  return useMemo(
    () =>
      new Api(
        axios.create({
          baseURL: uri,
        })
      ),
    [chainId, uri]
  )
}
