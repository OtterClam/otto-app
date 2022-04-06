export interface RawOtto {
  tokenId: any
  tokenURI: string
  mintAt: any
  legendary: boolean
}

export interface Attr {
  trait_type: string
  value: string | number
}

export interface OttoMeta {
  name: string
  image: string
  description: string
  otto_attrs: [Attr]
  otto_traits: [Attr]
  animation_url: string
}

export default class Otto {
  private raw: RawOtto

  private voice: HTMLAudioElement

  public metadata: OttoMeta

  public readonly baseRarityScore: number = 0

  public readonly gender: string = ''

  public readonly personality: string = ''

  public readonly birthday: Date = new Date()

  public readonly voiceName: string = ''

  constructor(raw: RawOtto, metadata: OttoMeta) {
    this.raw = raw
    this.metadata = metadata
    this.voice = new Audio(this.metadata.animation_url)
    this.voice.load()

    for (let idx = 0; idx < this.metadata.otto_attrs.length; idx++) {
      const { trait_type, value } = this.metadata.otto_attrs[idx]
      if (trait_type === 'BRS') {
        this.baseRarityScore = Number(value)
      }
    }

    for (let idx = 0; idx < this.metadata.otto_traits.length; idx++) {
      const { trait_type, value } = this.metadata.otto_traits[idx]
      if (trait_type === 'Gender') {
        this.gender = String(value)
      }
      if (trait_type === 'Personality') {
        this.personality = String(value)
      }
      if (trait_type === 'Birthday') {
        this.birthday = new Date(Number(value) * 1000)
      }
      if (trait_type === 'Voice') {
        this.voiceName = String(value)
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

  public playVoice() {
    this.voice.play()
  }
}
