import { ChainId } from '@usedapp/core'
import axios, { Axios } from 'axios'
import { BigNumberish, ethers } from 'ethers'
import {
  AdventureExploreArgs,
  AdventureLocation,
  RawAdventureExploreArgs,
  RawAdventureLocation,
  rawAdventureLocationToAdventureLocation,
} from 'models/AdventureLocation'
import { AdventurePreview, RawAdventurePreview, rawAdventurePreviewToAdventurePreview } from 'models/AdventurePreview'
import { AdventureResult, fromRawResult } from 'models/AdventureResult'
import { Dice } from 'models/Dice'
import { ForgeFormula, RawForgeFormula, rawForgeToForge } from 'models/Forge'
import {
  Item,
  ItemAction,
  ItemMetadata,
  ItemStatName,
  RawItemMetadata,
  rawItemMetadataToItemMetadata,
} from 'models/Item'
import { LeaderboardEpoch, RawLeaderboardEpoch, rawLeaderboardEpochToLeaderboardEpoch } from 'models/LeaderboardEpoch'
import { Mission, MissionInfo, rawMissionToMission } from 'models/Mission'
import { Notification, RawNotification } from 'models/Notification'
import { RawOtto } from 'models/Otto'
import Product from 'models/store/Product'
import retry from 'retry'
import { RawAdventureResult } from './RawAdventureResult'

export interface OttoCandidateMeta {
  name: string
  gender: string
  image: string
}

export interface ChestStoreResponse {
  regulars: SellData[]
  flashSells: SellData[]
}

export interface SellData {
  id: number
  type: ItemStatName
  name: string
  desc: string
  popup_title: string
  popup_desc: string
  popup_image: string
  start_time: number
  end_time: number
  products: Product[]
  special_items: ItemMetadata[]
  processing_images: string[]
}

export interface FishStoreProduct extends Product {
  start_time: number
  end_time: number
  item: Item
}

export interface FishStoreResponse {
  id: number
  title: string
  desc: string
  products: FishStoreProduct[]
  bg_img: string
  left_img: string
  right_img: string
}

export type MissionFilter = 'ongoing' | 'finished'

if (!process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET || !process.env.NEXT_PUBLIC_API_ENDPOINT_MUMBAI) {
  console.error('API endpoints are not defined')
}

const otterclamApiEndpoint: { [key: number]: string } = {
  [ChainId.Polygon]: process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET ?? '',
  [ChainId.Mumbai]: process.env.NEXT_PUBLIC_API_ENDPOINT_MUMBAI ?? '',
}

export class Api {
  private chainId: ChainId

  private otterclamClient: Axios

  constructor(chainId: ChainId, public readonly locale: string) {
    this.chainId = chainId
    this.otterclamClient = axios.create({
      baseURL: otterclamApiEndpoint[chainId],
    })
    this.setLanguage(locale)
  }

  withAbortController(abortController: AbortController) {
    const newClient = new Api(this.chainId, this.locale)
    newClient.otterclamClient.defaults.signal = abortController.signal
    return newClient
  }

  private setLanguage(lang: string): void {
    this.otterclamClient.defaults.headers.common['Accept-language'] = lang
  }

  public async getPortalCandidates(portalId: string): Promise<OttoCandidateMeta[]> {
    return this.otterclamClient.get(`/ottos/candidates/metadata/${portalId}`).then(res => res.data)
  }

  public async getOttoMeta(ottoId: string, details: boolean, abortSignal?: AbortSignal): Promise<RawOtto> {
    return this.otterclamClient
      .get(`/ottos/metadata/${ottoId}`, { params: { details }, signal: abortSignal })
      .then(res => res.data)
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

  public async getItemsMetadata(
    tokenIds: string[],
    abortSignal?: AbortSignal
  ): Promise<{ [tokenId: string]: ItemMetadata }> {
    return this.otterclamClient
      .get<RawItemMetadata[]>(`/items/metadata?ids=${tokenIds.join(',')}`, { signal: abortSignal })
      .then(res =>
        res.data.reduce((map, metadata) => {
          map[metadata.id] = rawItemMetadataToItemMetadata(metadata)
          return map
        }, {} as { [tokenId: string]: ItemMetadata })
      )
  }

  public async rollTheDice(ottoId: string, tx: string): Promise<Dice> {
    return new Promise((resolve, reject) => {
      const operation = retry.operation({
        retries: 5,
        factor: 3,
        minTimeout: 1 * 1000,
        maxTimeout: 60 * 1000,
        randomize: true,
      })
      operation.attempt(async () => {
        try {
          const response = await this.otterclamClient.post(`/ottos/${ottoId}/helldice/${tx}`, null)
          resolve(new Dice(response.data))
        } catch (e) {
          if (operation.retry(e as Error)) {
            return
          }
          reject(e)
        }
      })
    })
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

  public async getChestStore(): Promise<ChestStoreResponse> {
    const toSellData = (raw: any): SellData => ({
      ...raw,
      start_time: new Date(raw.start_time).valueOf(),
      end_time: new Date(raw.end_time).valueOf(),
      special_items: raw.special_items.map((raw: RawItemMetadata) => rawItemMetadataToItemMetadata(raw)),
    })
    return this.otterclamClient.get('/chest-store').then(res => ({
      regulars: res.data.regulars.map(toSellData),
      flashSells: res.data.flashSells.map(toSellData),
    }))
  }

  public async getFishStoreProducts(): Promise<FishStoreResponse[]> {
    return this.otterclamClient.get('/store').then(res => {
      return res.data.map((data: any) => ({
        ...data,
        products: data.products.map((raw: any): FishStoreProduct => {
          const itemMeta = rawItemMetadataToItemMetadata(raw.item)
          return {
            ...raw,
            displayPrice: ethers.utils.formatEther(raw.price),
            discountPrice: raw.discount_price,
            displayDiscountPrice: ethers.utils.formatEther(raw.discount_price),
            start_time: new Date(raw.start_time).valueOf(),
            end_time: new Date(raw.end_time).valueOf(),
            item: {
              id: String(raw.item_id),
              amount: 1,
              updatedAt: new Date(),
              metadata: itemMeta,
              unreturnable: false,
            },
          }
        }),
      }))
    })
  }

  public async signFishStoreProduct({ from, to, productId }: { from: string; to: string; productId: number }) {
    return this.otterclamClient.post('/store/buy', { from, to, product_id: productId }).then(res => res.data)
  }

  public async signBuyProduct({ from, to, id, amount }: { from: string; to: string; id: number; amount: number }) {
    return this.otterclamClient.post('/chest-store/buy', { from, to, id, amount }).then(res => res.data)
  }

  public async signOpenChest({
    from,
    to,
    itemId,
    amount,
  }: {
    from: string
    to: string
    itemId: number
    amount: number
  }) {
    return this.otterclamClient.post('/chest-store/open', { from, to, id: itemId, amount }).then(res => res.data)
  }

  public async getFoundryForges(): Promise<ForgeFormula[]> {
    const result = await this.otterclamClient.get<RawForgeFormula[]>('/foundry/formulas')
    return result.data.map(rawForgeToForge)
  }

  public async getAdventureOttos(wallet: string, abortSignal?: AbortSignal): Promise<RawOtto[]> {
    const result = await this.otterclamClient.get<RawOtto[]>(`/adventure/wallets/${wallet}`, { signal: abortSignal })
    return result.data
  }

  public async getOttoAdventurePreview(
    ottoId: string,
    locationId: number | undefined,
    actions: ItemAction[],
    abortSignal?: AbortSignal
  ): Promise<AdventurePreview> {
    let url = locationId ? `/ottos/${ottoId}/adventure/locations/${locationId}/preview` : `/ottos/${ottoId}/preview`
    if (actions.length) {
      url += `?actions=${JSON.stringify(actions)}`
    }
    const result = await this.otterclamClient.get<RawAdventurePreview>(url, { signal: abortSignal })
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
    const result = await this.otterclamClient.post<RawAdventureExploreArgs>('/adventure/explore', {
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
    const result = await this.otterclamClient.post('/adventure/finish', {
      otto_id: ottoId,
      wallet,
      immediately,
      potions,
    })
    return result.data
  }

  public async getForgeCalldata(formulaId: number, account: string) {
    const result = await this.otterclamClient.post('/foundry/fuse', {
      id: formulaId,
      wallet: account,
    })
    return result.data
  }

  public async getAdventureResult(tx: string): Promise<AdventureResult> {
    const result = await this.otterclamClient.get<RawAdventureResult>(`/adventure/results/${tx}`)
    return fromRawResult(result.data)
  }

  public async getLeaderBoardEpoch(): Promise<LeaderboardEpoch> {
    const result = await this.otterclamClient.get<RawLeaderboardEpoch>('/leaderboard/epoch')
    return rawLeaderboardEpochToLeaderboardEpoch(result.data)
  }

  public async listMissions({
    account,
    filter,
    offset,
    limit,
  }: {
    account: string
    filter: MissionFilter
    offset?: number
    limit?: number
  }): Promise<Mission[]> {
    return this.otterclamClient
      .get(`/wallets/${account}/missions/${filter}`, { params: { offset, limit } })
      .then(res => res.data.map(rawMissionToMission))
  }

  public async getMissionInfo({ account }: { account: string }): Promise<MissionInfo> {
    const result = await this.otterclamClient.get(`/wallets/${account}/missions-info`)
    return {
      ...result.data,
      nextFreeMissionAt: new Date(result.data.next_free_mission_at),
      newPrice: result.data.new_price,
      newProductId: String(result.data.new_product_id),
      refreshPrice: result.data.refresh_price,
      refreshProductId: String(result.data.refresh_product_id),
    }
  }

  public async requestNewMission({ account, tx }: { account: string; tx?: string }): Promise<Mission> {
    const result = await this.otterclamClient.post(`/missions`, {
      wallet: account,
      tx_hash: tx,
    })
    return rawMissionToMission(result.data)
  }

  public async refreshMission({
    account,
    missionId,
    tx,
  }: {
    account: string
    missionId: number
    tx: string
  }): Promise<Mission> {
    return this.otterclamClient
      .put(`/missions/${missionId}/refresh`, {
        mission_id: missionId,
        tx_hash: tx,
      })
      .then(res => rawMissionToMission(res.data))
  }

  public async completeMission({ account, missionId }: { account: string; missionId: number }): Promise<any> {
    return this.otterclamClient.put(`/missions/${missionId}/complete`).then(res => res.data)
  }

  public async confirm({ missionId, tx }: { missionId: number; tx: string }): Promise<any> {
    return this.otterclamClient
      .put(`/missions/${missionId}/confirm`, {
        mission_id: missionId,
        tx_hash: tx,
      })
      .then(res => res.data)
  }

  public async getAdventureBoost() {
    const res = await this.otterclamClient.get<{ location?: string; success_rate?: number; image?: string }>(
      '/adventure/boost'
    )
    const { location, success_rate, image } = res.data ?? {}
    if (!location || !success_rate || !image) {
      return null
    }
    return {
      location,
      successRate: success_rate,
      image,
    }
  }
}

export const defaultApi = new Api(ChainId.Polygon, 'en')
