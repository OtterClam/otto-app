// TODO: remove otto class
import assert from 'assert'
import { Adventure } from 'contracts/__generated__'
import { BigNumber } from 'ethers'
import { RawAdventurePass } from 'libs/RawAdventureResult'
import { AdventurePass, fromRawPass } from './AdventurePass'
import { AdventureResult } from './AdventureResult'
import { ItemMetadata, Item } from './Item'

export enum TraitCollection {
  Genesis = 'genesis',
  Second = 'second',
}

type RawOttoGender = 'Otto' | 'Lottie' | 'Cleo'

export interface RawOtto {
  id: string
  name: string
  image: string
  gender: RawOttoGender
  description: string
  attributes: Attr[]
  otto_attrs: Attr[]
  otto_traits: Attr[]
  otto_details?: Trait[]
  otto_native_traits?: Trait[]
  animation_url: string
  token_uri: string
  mintAt: any
  legendary: boolean
  brs?: number
  rrs?: number
  rarity_score?: number
  constellation_boost?: number
  legendary_boost?: number
  epoch_rarity_boost?: number
  dice_count?: number
  image_wo_bg: string
  adventure_status: AdventureOttoStatus
  resting_until?: string
  level: number
  adventurer_title: string
  latest_adventure_pass?: RawAdventurePass
  adventure_passes_count: number
  next_level_exp: number
}

export interface Attr {
  trait_type: string
  value: string | number
}

export type TraitRarity = 'C3' | 'C2' | 'C1' | 'R3' | 'R2' | 'R1' | 'E3' | 'E2' | 'E1'

export type OttoGender = 'Male' | 'Female' | 'Both'

export interface TraitLabel {
  name: string
  match: boolean
}

export interface Trait {
  id: string
  type: string
  name: string
  image: string
  rarity: TraitRarity
  base_rarity_score: number
  relative_rarity_score: number
  total_rarity_score: number
  equipped_count: number
  wearable: boolean
  stats: Stat[]
  unreturnable: boolean
  equippable_gender: OttoGender
  collection: TraitCollection
  collection_name: string
  labels: TraitLabel[]
  theme_boost: number
}

export interface Stat {
  name: string
  value: string
}

export enum AdventureOttoStatus {
  Finished = 'finished',
  Ongoing = 'ongoing',
  Resting = 'resting',
  Ready = 'ready',
  Unavailable = 'unavailable',
}

export default class Otto {
  public raw: RawOtto

  private voice: HTMLAudioElement | undefined

  public baseRarityScore = ''

  public relativeRarityScore = ''

  public totalRarityScore = ''

  public gender = ''

  public personality = ''

  public birthday: Date = new Date()

  public voiceName = ''

  public coatOfArms = ''

  public armsImage = ''

  public zodiacSign = ''

  public ranking = 0

  public geneticTraits: Trait[] = []

  public wearableTraits: Trait[] = []

  public geneticItemsMetadata: ItemMetadata[] = []

  public wearableItemsMetadata: ItemMetadata[] = []

  public epochRarityBoost?: number

  public diceCount?: number

  public restingUntil?: Date

  public latestAdventurePass?: AdventurePass

  public exp = 0

  public ap = 0

  public themeBoost = 0

  public themeBoostMultiplier = 1

  public cachedAdventureStatus: AdventureOttoStatus = AdventureOttoStatus.Ready

  public attributePoints = 0

  public adventurePassesCount = 0

  constructor(
    raw: RawOtto,
    public equippedItems: Item[] = [],
    public nativeItemsMetadata: ItemMetadata[] = [],
    public itemsMetadata: ItemMetadata[] = []
  ) {
    this.raw = raw
    this.rawUpdated()
  }

  private rawUpdated() {
    this.voice = new Audio(this.raw.animation_url)
    this.voice.load()
    this.nativeItemsMetadata = this.nativeItemsMetadata.map(metadata => ({
      ...metadata,
      unreturnable: true,
    }))
    this.baseRarityScore = this.raw.brs ? String(this.raw.brs) : '?'
    this.relativeRarityScore = this.raw.rrs ? String(this.raw.rrs) : '?'
    this.totalRarityScore = this.raw.rarity_score ? String(this.raw.rarity_score) : '?'
    this.epochRarityBoost = this.raw.epoch_rarity_boost
    this.diceCount = this.raw.dice_count
    this.adventurePassesCount = this.raw.adventure_passes_count

    if (this.raw.latest_adventure_pass) {
      this.latestAdventurePass = fromRawPass(this.raw.latest_adventure_pass)
    }
    this.restingUntil = this.raw.resting_until ? new Date(this.raw.resting_until) : undefined

    for (let idx = 0; idx < this.raw.attributes?.length ?? 0; idx++) {
      const { trait_type, value } = this.raw.attributes[idx]
      if (trait_type === 'Coat of Arms') {
        this.armsImage = String(value)
      }
    }

    if (!this.raw.otto_traits) {
      console.log(this.raw)
    }
    for (let idx = 0; idx < this.raw.otto_traits?.length ?? 0; idx++) {
      const { trait_type, value } = this.raw.otto_traits[idx]
      if (trait_type === 'Gender') {
        this.gender = String(value)
      } else if (trait_type === 'Personality') {
        this.personality = String(value)
      } else if (trait_type === 'Birthday') {
        this.birthday = new Date(Number(value) * 1000)
      } else if (trait_type === 'Voice') {
        this.voiceName = String(value)
      } else if (trait_type === 'Coat of Arms') {
        this.coatOfArms = String(value)
      } else if (trait_type === 'Ranking') {
        this.ranking = Number(value)
      } else if (trait_type === 'Zodiac Sign') {
        this.zodiacSign = String(value)
      } else if (trait_type === 'EXP') {
        this.exp = Number(value)
      } else if (trait_type === 'AP') {
        this.ap = Number(value)
      } else if (trait_type === 'Theme Boost') {
        this.themeBoost = Number(value ?? '0')
      } else if (trait_type === 'Theme Boost Multiplier') {
        this.themeBoostMultiplier = Number(value ?? '1')
      } else if (trait_type === 'Attribute Points') {
        this.attributePoints = Number(value ?? '0')
      }
    }

    if (this.raw.otto_details) {
      for (let idx = 0; idx < this.raw.otto_details?.length ?? 0; idx++) {
        const trait = this.raw.otto_details[idx]
        if (trait.wearable) {
          this.wearableTraits.push(trait)
        } else {
          this.geneticTraits.push(trait)
        }
      }
    }

    this.cachedAdventureStatus = this.adventureStatus

    this.geneticItemsMetadata = this.itemsMetadata.filter(itemMetadata => !itemMetadata.wearable)
    this.wearableItemsMetadata = this.itemsMetadata.filter(itemMetadata => itemMetadata.wearable)
  }

  get name(): string {
    return this.raw.name
  }

  get image(): string {
    return this.raw.image
  }

  get description(): string {
    return this.raw.description
  }

  get id(): string {
    return this.raw.id
  }

  get tokenURI(): string {
    return this.raw.token_uri
  }

  get legendary(): boolean {
    return this.raw.legendary
  }

  get displayAttrs() {
    return (this.raw.otto_attrs ?? []).filter(
      p => p.trait_type !== 'BRS' && p.trait_type !== 'TRS' && p.trait_type !== 'RRS'
    )
  }

  get isChosenOne(): boolean {
    return this.raw.constellation_boost === 150
  }

  get zodiacBoost(): number {
    return this.raw.constellation_boost || 0
  }

  get imageWoBg(): string {
    return this.raw.image_wo_bg
  }

  get level(): number {
    return this.raw.level
  }

  get adventureStatus(): AdventureOttoStatus {
    const now = new Date()
    if (this.restingUntil && this.restingUntil.getTime() !== 0) {
      if (this.restingUntil >= now) {
        return AdventureOttoStatus.Resting
      }
    }
    if (this.latestAdventurePass && !this.latestAdventurePass.finishedAt) {
      if (this.latestAdventurePass.canFinishAt > now) {
        return AdventureOttoStatus.Ongoing
      }
      return AdventureOttoStatus.Finished
    }
    return AdventureOttoStatus.Ready
  }

  get currentLocationId(): number | undefined {
    if (this.latestAdventurePass && !this.latestAdventurePass.finishedAt) {
      return this.latestAdventurePass.locationId
    }
  }

  get availableForItem(): boolean {
    return this.adventureStatus !== AdventureOttoStatus.Ongoing && this.adventureStatus !== AdventureOttoStatus.Finished
  }

  get next_level_exp(): number {
    // TODO: remove the default value
    return this.raw.next_level_exp ?? 1
  }

  get adventurerTitle() {
    return this.raw.adventurer_title
  }

  get ottoNativeTraits() {
    return this.raw.otto_native_traits ?? []
  }

  public clone() {
    return new Otto(JSON.parse(JSON.stringify(this.raw)), this.equippedItems)
  }

  public playVoice() {
    this.voice?.play()
  }

  private updateTrait(type: string, cb: (val: string | number) => string | number) {
    const trait = this.raw.otto_traits.find(trait => trait.trait_type === type)
    if (trait) {
      trait.value = cb(trait.value)
    }
  }

  // TODO: use ItemMetadata
  public canWear(item: Item): boolean {
    if (item.metadata.equippableGender === 'Both' || this.raw.gender === 'Cleo') {
      return true
    }
    if (item.metadata.equippableGender === 'Male') {
      return this.raw.gender === 'Otto'
    }
    return this.raw.gender === 'Lottie'
  }

  public explore(passId: string, pass: Adventure.PassStruct) {
    this.raw.latest_adventure_pass = {
      id: passId,
      location_id: BigNumber.from(pass.locId).toNumber(),
      departure_at: new Date(BigNumber.from(pass.departureAt).toNumber() * 1000).toISOString(),
      can_finish_at: new Date(BigNumber.from(pass.canFinishAt).toNumber() * 1000).toISOString(),
    }
    this.rawUpdated()
  }

  public finish(result: AdventureResult) {
    assert(this.raw.latest_adventure_pass, 'No adventure pass')

    this.raw.resting_until = result.restingUntil.toISOString()

    this.raw.latest_adventure_pass = {
      ...this.raw.latest_adventure_pass,
      id: result.pass.id,
      finished_at: result.pass.finishedAt ? result.pass.finishedAt.toISOString() : undefined,
      finished_tx: result.pass.finishedTx,
    }

    this.updateTrait('EXP', val => Number(val) + result.rewards.exp)

    if (result.events.level_up) {
      const {
        to: { exp, level, expToNextLevel },
        got,
      } = result.events.level_up
      this.raw.resting_until = new Date().toISOString()
      this.raw.next_level_exp = expToNextLevel
      this.updateTrait('EXP', () => exp)
      this.updateTrait('LEVEL', () => level)
      this.updateTrait('Attribute Points', () => got.attrs_points)
    }

    this.rawUpdated()
  }

  toJSON() {
    return {
      raw: this.raw,
    }
  }

  static fromJSON({ raw }: ReturnType<Otto['toJSON']>) {
    return new Otto(raw)
  }
}

export interface OttoAttrsDiff {
  [k: string]: number
}

export function diffTraitAttrs(a: Trait, b: Trait): OttoAttrsDiff {
  const stats = a.stats.reduce(
    (map, stat) => Object.assign(map, { [stat.name]: stat.value }),
    {} as { [k: string]: number }
  )
  const result: OttoAttrsDiff = {}
  b.stats.forEach(stat => {
    const aValue = isNaN(Number(stat.value)) ? 0 : Number(stat.value)
    const bValue = isNaN(Number(stats[stat.name])) ? 0 : Number(Number(stats[stat.name]))
    result[stat.name] = aValue - bValue
  })
  return result
}

export function mergeTraitDiffs(a: OttoAttrsDiff, b: OttoAttrsDiff): OttoAttrsDiff {
  const result: OttoAttrsDiff = {}
  Object.entries(b).forEach(([key, val]) => {
    result[key] = val + (a[key] ?? 0)
  })
  return result
}

export function applyAttrsDiffToOtto(otto: Otto, diff: OttoAttrsDiff): Otto {
  const metadata = {
    ...otto.raw,
    otto_attrs: otto.raw.otto_attrs.map(attr => ({
      trait_type: attr.trait_type,
      value: Number(attr.value) + (diff[attr.trait_type] ?? 0),
    })),
  }
  return new Otto(metadata)
}
