import { Adventure } from 'contracts/__generated__'
import { BigNumber } from 'ethers'
import { getCroppedImageUrl } from 'utils/image'

export enum TraitCollection {
  Genesis = 'genesis',
  Second = 'second',
}

export interface RawAdventurePass {
  location_id: number
  finished_tx?: string
  departure_at: string
  can_finish_at: string
  finished_at?: string
}

export interface RawOtto {
  id: string
  name: string
  image: string
  description: string
  attributes: Attr[]
  otto_attrs: Attr[]
  otto_traits: Attr[]
  otto_details?: Trait[]
  animation_url: string
  tokenURI: string
  mintAt: any
  legendary: boolean
  brs?: number
  rrs?: number
  rarityScore?: number
  constellationBoost?: number
  legendaryBoost?: number
  epochRarityBoost?: number
  diceCount?: number
  image_wo_bg: string
  adventure_status: AdventureOttoStatus
  resting_until?: string
  level: number
  latest_adventure_pass?: RawAdventurePass
}

export interface Attr {
  trait_type: string
  value: string | number
}

export enum TraitRarity {
  C3 = 'C3',
  C2 = 'C2',
  C1 = 'C1',
  R3 = 'R3',
  R2 = 'R2',
  R1 = 'R1',
  E3 = 'E3',
  E2 = 'E2',
  E1 = 'E1',
}

export enum OttoGender {
  Male = 'Male',
  Female = 'Female',
  Both = 'both',
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
  collection?: TraitCollection
  collection_name?: string
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

export interface AdventurePass {
  locationId: number
  finishedAt?: Date
  finishedTx?: string
  departureAt: Date
  canFinishAt: Date
}

export default class Otto {
  public raw: RawOtto

  private voice: HTMLAudioElement

  public readonly baseRarityScore: string = ''

  public readonly relativeRarityScore: string = ''

  public readonly totalRarityScore: string = ''

  public readonly gender: string = ''

  public readonly personality: string = ''

  public readonly birthday: Date = new Date()

  public readonly voiceName: string = ''

  public readonly coatOfArms: string = ''

  public readonly armsImage: string = ''

  public readonly zodiacSign: string = ''

  public readonly ranking: number = 0

  public readonly geneticTraits: Trait[] = []

  public readonly wearableTraits: Trait[] = []

  public readonly epochRarityBoost?: number

  public readonly diceCount?: number

  public adventureStatus: AdventureOttoStatus

  public latestAdventurePass?: AdventurePass | undefined

  constructor(raw: RawOtto) {
    this.raw = raw
    this.voice = new Audio(this.raw.animation_url)
    this.voice.load()
    this.baseRarityScore = this.raw.brs ? String(this.raw.brs) : '?'
    this.relativeRarityScore = this.raw.rrs ? String(this.raw.rrs) : '?'
    this.totalRarityScore = this.raw.rarityScore ? String(this.raw.rarityScore) : '?'
    this.epochRarityBoost = this.raw.epochRarityBoost
    this.diceCount = this.raw.diceCount
    this.adventureStatus = this.raw.adventure_status

    if (this.raw.latest_adventure_pass)
      this.latestAdventurePass = {
        finishedTx: this.raw.latest_adventure_pass.finished_tx,
        locationId: this.raw.latest_adventure_pass.location_id,
        departureAt: new Date(this.raw.latest_adventure_pass.departure_at),
        finishedAt: this.raw.latest_adventure_pass.finished_at
          ? new Date(this.raw.latest_adventure_pass.finished_at)
          : undefined,
        canFinishAt: new Date(this.raw.latest_adventure_pass.can_finish_at),
      }

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
  }

  get name(): string {
    return this.raw.name
  }

  get image(): string {
    return this.raw.image
  }

  get largeImage(): string {
    return getCroppedImageUrl(this.image, { w: 900, h: 900 })
  }

  get mediumImage(): string {
    return getCroppedImageUrl(this.image, { w: 400, h: 400 })
  }

  get smallImage(): string {
    return getCroppedImageUrl(this.image, { w: 200, h: 200 })
  }

  get description(): string {
    return this.raw.description
  }

  get id(): string {
    return this.raw.id
  }

  get tokenURI(): string {
    return this.raw.tokenURI
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
    return this.raw.constellationBoost === 150
  }

  get zodiacBoost(): number {
    return this.raw.constellationBoost || 0
  }

  get imageWoBg(): string {
    return this.raw.image_wo_bg
  }

  get restingUntil(): Date | undefined {
    return this.raw.resting_until ? new Date(this.raw.resting_until) : undefined
  }

  get level(): number {
    return this.raw.level
  }

  public playVoice() {
    this.voice?.play()
  }

  public depart(pass: Adventure.PassStruct) {
    this.adventureStatus = AdventureOttoStatus.Ongoing
    this.latestAdventurePass = {
      locationId: BigNumber.from(pass.locId).toNumber(),
      departureAt: new Date(BigNumber.from(pass.departureAt).toNumber() * 1000),
      canFinishAt: new Date(BigNumber.from(pass.canFinishAt).toNumber() * 1000),
    }
  }

  toJSON() {
    return {
      raw: this.raw,
      metadata: this.raw,
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
  return new Otto(otto.raw)
}
