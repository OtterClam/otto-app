import md5 from 'md5'
import axios, { Axios } from 'axios'
import redis from './redis'

export interface AirtableOptions {
  baseId: string
  apiKey: string
  expire?: number // seconds
}

export class Airtable {
  private client: Axios

  private expire: number

  constructor({ baseId, apiKey, expire = 60 * 60 * 24 }: AirtableOptions) {
    this.expire = expire
    this.client = axios.create({
      baseURL: `https://api.airtable.com/v0/${baseId}`,
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  }

  private getCacheKey(uri: string): string {
    return `airtable:request:${md5(uri)}`
  }

  async updateCache(uri: string) {
    const key = this.getCacheKey(uri)
    const data = await this._fetch(uri)
    await redis.setex(key, this.expire, data)
    return data
  }

  async fetch(uri: string) {
    const key = this.getCacheKey(uri)
    const data = await redis.get(key)
    if (data) {
      return data
    }
    return this.updateCache(uri)
  }

  private async _fetch(uri: string) {
    const res = await this.client.get(uri)
    return JSON.stringify(res.data)
  }
}

export default new Airtable({
  baseId: process.env.AIRTABLE_BASE_ID as string,
  apiKey: process.env.AIRTABLE_API_KEY as string,
  expire: process.env.AIRTABLE_EXPIRE ? Number(process.env.AIRTABLE_EXPIRE) : undefined,
})
