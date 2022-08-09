/* eslint-disable max-classes-per-file */
export interface AssetsBundle {
  name: string
  isBasicBundle: boolean
  matchRoute: (route: string) => boolean
  files: string[]
}

export class BasicAssetsBundle {
  readonly isBasicBundle = true

  matchRoute(route: string): boolean {
    return false
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(readonly name: string, readonly files: string[]) {}
}

export class GeneralAssetsBundle {
  readonly isBasicBundle = false

  matchRoute(route: string): boolean {
    return false
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(readonly name: string, readonly files: string[]) {}
}

export class PageAssetsBundle {
  readonly isBasicBundle = false

  matchRoute(route: string): boolean {
    return this.routeRegex.test(route)
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(readonly name: string, private routeRegex: RegExp, readonly files: string[]) {}
}
