export interface RawOtto {
  tokenId: any
  tokenURI: string
  mintAt: any
  legendary: boolean
}

export default class Otto {
  private raw: RawOtto

  constructor(raw: RawOtto) {
    this.raw = raw
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
