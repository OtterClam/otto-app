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
}

export default class Otto {
  private raw: RawOtto

  public metadata: OttoMeta

  constructor(raw: RawOtto, metadata: OttoMeta) {
    this.raw = raw
    this.metadata = metadata
  }

  get name(): string {
    return this.metadata.name
  }

  get image(): string {
    return this.metadata.image
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
}
