import { PortalStatus } from '__generated__/global-types'

export interface RawPortal {
  tokenId: any
  tokenURI: string
  portalStatus: PortalStatus
  canOpenAt: any
  mintAt: any
}

export enum PortalState {
  UNOPENED = 'UNOPENED',
  CAN_OPEN = 'CAN_OPEN',
  OPENED = 'OPENED',
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

  public state(now: number): PortalState {
    if (this.raw.portalStatus === PortalStatus.OPENED) {
      return PortalState.OPENED
    }

    if (this.canOpenAt < now) {
      return PortalState.CAN_OPEN
    }

    return PortalState.UNOPENED
  }

  public openProgress(now: number): number {
    return Math.round(Math.min(100, 100 - ((this.canOpenAt - now) / (7 * 86400 * 1000)) * 100))
  }
}
