import { ChainId, useEthers } from '@usedapp/core'
import axios, { Axios } from 'axios'
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

  public async getOttoMetas(ids: string[], lang: string, details: boolean): Promise<OttoMeta[]> {
    return this.axios.get(`/ottos/metadata?ids=${ids.join(',')}`, { params: { details, lang } }).then(res => res.data)
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
      ...details,
    }
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
