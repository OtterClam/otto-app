export interface RawOtto {
  tokenId: any
  tokenURI: string
  mintAt: any
  legendary: boolean
  brs?: number
  rrs?: number
  rarityScore?: number
  constellationBoost?: number
}

export interface Attr {
  trait_type: string
  value: string | number
}

export interface Trait {
  type: string
  name: string
  image: string
  rarity: string
  base_rarity_score: number
  relative_rarity_score: number
  total_rarity_score: number
  wearable: boolean
  stats: [Stat]
  unreturnable: boolean
  equippable_gender: string
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

  public readonly constellation: string = ''

  public readonly ranking: number = 0

  public readonly geneticTraits: Trait[] = []

  public readonly wearableTraits: Trait[] = []

  constructor(raw: RawOtto, metadata: OttoMeta) {
    this.raw = raw
    this.metadata = metadata
    this.voice = new Audio(this.metadata.animation_url)
    this.voice.load()
    this.baseRarityScore = this.raw.brs ? String(this.raw.brs) : '?'
    this.relativeRarityScore = this.raw.rrs ? String(this.raw.rrs) : '?'
    this.totalRarityScore = this.raw.rarityScore ? String(this.raw.rarityScore) : '?'

    for (let idx = 0; idx < this.metadata.attributes.length; idx++) {
      const { trait_type, value } = this.metadata.attributes[idx]
      if (trait_type === 'Coat of Arms') {
        this.armsImage = String(value)
      }
    }

    for (let idx = 0; idx < this.metadata.otto_traits.length; idx++) {
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
      } else if (trait_type === 'Constellation') {
        this.constellation = String(value)
      }
    }

    if (this.metadata.otto_details) {
      for (let idx = 0; idx < this.metadata.otto_details.length; idx++) {
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
    return this.metadata.otto_attrs.filter(
      p => p.trait_type !== 'BRS' && p.trait_type !== 'TRS' && p.trait_type !== 'RRS'
    )
  }

  public playVoice() {
    this.voice.play()
  }
}
