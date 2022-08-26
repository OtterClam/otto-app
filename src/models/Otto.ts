import { getCroppedImageUrl } from 'utils/image'

export enum TraitCollection {
  Genesis = 'genesis',
  Second = 'second',
}

export interface RawOtto {
  tokenId: any
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
  stats: [Stat]
  unreturnable: boolean
  equippable_gender: string
  collection: TraitCollection
  collection_name: string
}

export interface Stat {
  name: string
  value: string
}

export interface OttoMeta {
  name: string
  image: string
  description: string
  attributes: [Attr]
  otto_attrs: [Attr]
  otto_traits: [Attr]
  otto_details?: [Trait]
  animation_url: string
}

export default class Otto {
  public raw: RawOtto

  private voice: HTMLAudioElement

  public metadata: OttoMeta

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

  constructor(raw: RawOtto, metadata: OttoMeta) {
    this.raw = raw
    this.metadata = metadata
    this.voice = new Audio(this.metadata.animation_url)
    this.voice.load()
    this.baseRarityScore = this.raw.brs ? String(this.raw.brs) : '?'
    this.relativeRarityScore = this.raw.rrs ? String(this.raw.rrs) : '?'
    this.totalRarityScore = this.raw.rarityScore ? String(this.raw.rarityScore) : '?'
    this.epochRarityBoost = this.raw.epochRarityBoost
    this.diceCount = this.raw.diceCount

    for (let idx = 0; idx < this.metadata.attributes?.length ?? 0; idx++) {
      const { trait_type, value } = this.metadata.attributes[idx]
      if (trait_type === 'Coat of Arms') {
        this.armsImage = String(value)
      }
    }

    if (!this.metadata.otto_traits) {
      console.log(this.metadata)
    }
    for (let idx = 0; idx < this.metadata.otto_traits?.length ?? 0; idx++) {
      const { trait_type, value } = this.metadata.otto_traits[idx]
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

    if (this.metadata.otto_details) {
      for (let idx = 0; idx < this.metadata.otto_details?.length ?? 0; idx++) {
        const trait = this.metadata.otto_details[idx]
        if (trait.wearable) {
          this.wearableTraits.push(trait)
        } else {
          this.geneticTraits.push(trait)
        }
      }
    }
  }

  get name(): string {
    return this.metadata.name
  }

  get image(): string {
    return this.metadata.image
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
    return this.metadata.description
  }

  get tokenId(): string {
    return this.raw.tokenId.toString()
  }

  get tokenURI(): string {
    return this.raw.tokenURI
  }

  get legendary(): boolean {
    return this.raw.legendary
  }

  get displayAttrs() {
    return (this.metadata.otto_attrs ?? []).filter(
      p => p.trait_type !== 'BRS' && p.trait_type !== 'TRS' && p.trait_type !== 'RRS'
    )
  }

  get isChosenOne(): boolean {
    return this.raw.constellationBoost === 150
  }

  get zodiacBoost(): number {
    return this.raw.constellationBoost || 0
  }

  public playVoice() {
    this.voice?.play()
  }

  toJSON() {
    return {
      raw: this.raw,
      metadata: this.metadata,
    }
  }

  static fromJSON({ raw, metadata }: ReturnType<Otto['toJSON']>) {
    return new Otto(raw, metadata)
  }
}
