import { PortalStatus } from '__generated__/global-types'

export interface RawPortal {
  tokenId: any
  tokenURI: string
  portalStatus: PortalStatus
  canOpenAt: any
  mintAt: any
  candidates: string[]
  legendary: boolean
}

export enum PortalState {
  CHARGING = 'CHARGING',
  CAN_OPEN = 'CAN_OPEN',
  OPENED = 'OPENED',
  SUMMONED = 'SUMMONED',
}

export default class Portal {
  private raw: RawPortal

  constructor(raw: RawPortal) {
    this.raw = raw
  }

  get tokenId(): string {
    return this.raw.tokenId.toString()
  }

  get canOpenAt(): number {
    return Number(this.raw.canOpenAt) * 1000
  }

  get tokenURI(): string {
    return this.raw.tokenURI
  }

  get candidates(): string[] {
    return this.raw.candidates
  }

  get legendary(): boolean {
    return this.raw.legendary
  }

  get beforeOpen(): boolean {
    return this.raw.portalStatus === PortalStatus.UNOPENED
  }

  public state(now: number): PortalState {
    if (this.raw.portalStatus === PortalStatus.OPENED) {
      return PortalState.OPENED
    }

    if (this.raw.portalStatus === PortalStatus.SUMMONED) {
      return PortalState.SUMMONED
    }

    if (this.canOpenAt < now) {
      return PortalState.CAN_OPEN
    }

    return PortalState.CHARGING
  }

  public openProgress(now: number): number {
    return Math.round(Math.min(100, 100 - ((this.canOpenAt - now) / (7 * 86400 * 1000)) * 100))
  }
}
