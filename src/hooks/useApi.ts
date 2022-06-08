import { ChainId, useEthers } from '@usedapp/core'
import axios, { Axios } from 'axios'
import { Dice } from 'models/Dice'
import Item from 'models/Item'
import { OttoMeta } from 'models/Otto'
import { useMemo } from 'react'

export interface OttoCandidateMeta {
  name: string
  gender: string
  image: string
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
      ...details,
    }
  }

  public async rollTheDice(): Promise<Dice> {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })
    return new Dice({
      id: 'test',
      status: 'waiting_anwser',
      events: [{ effect: { brs: 100, ranking: 10 } }, { questions: ['test1', 'abc', '222'] }],
    })
  }

  public async getDice(id?: string): Promise<Dice> {
    return this.rollTheDice()
  }

  public async answerDiceQuestion(diceId: string, index: number, answer: number): Promise<Dice> {
    return new Dice({
      id: 'test',
      status: 'waiting_anwser',
      events: [{ effect: { brs: 100, ranking: 10 } }, { effect: { brs: -100, ranking: -10 } }],
    })
  }

  public async retryADice(diceId: string): Promise<Dice> {
    return this.rollTheDice()
  }
}

export default function useApi() {
  const { chainId } = useEthers()
  let uri = process.env.REACT_APP_API_ENDPOINT_MAINNET
  if (chainId === ChainId.Mumbai) {
    uri = process.env.REACT_APP_API_ENDPOINT_MUMBAI
  }
  const client = useMemo(
    () =>
      new Api(
        axios.create({
          baseURL: uri,
        })
      ),
    [chainId, uri]
  )
  return client
}
