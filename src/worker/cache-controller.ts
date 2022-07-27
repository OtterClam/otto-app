import { AssetsBundle } from './assets-bundles/bundle'
import { CACHE_VERSION } from './consts'

// eslint-disable-next-line no-restricted-globals
const baseUrl = `${self.location.protocol}//${self.location.host}`

export interface CacheControllerOptions {
  bundles: AssetsBundle[]
  onFileLoaded: (bundle: AssetsBundle, url: string, err?: Error) => void
  onUpdateBundle: (bundle: AssetsBundle) => void
}

export class CacheController {
  private progress = new Map<AssetsBundle, Set<string>>()

  private lock = new Map<AssetsBundle, boolean>()

  private bundleMap: Map<string, AssetsBundle>

  private bundles: AssetsBundle[]

  private onFileLoaded: (bundle: AssetsBundle, url: string, err?: Error) => void

  private onUpdateBundle: (bundle: AssetsBundle) => void

  constructor({ bundles, onFileLoaded, onUpdateBundle }: CacheControllerOptions) {
    this.bundles = bundles
    this.onFileLoaded = onFileLoaded
    this.onUpdateBundle = onUpdateBundle
    this.bundleMap = new Map(bundles.map(bundle => [bundle.name, bundle]))
  }

  async clearOldCache(): Promise<void> {
    console.log('[worker] clear old caches...')
    const keys = await caches.keys()

    await Promise.all(
      keys
        .filter(key => key.startsWith('bundle_') && !key.startsWith(`bundle_${CACHE_VERSION}_`))
        .map(key => {
          console.log(`[worker] delete cache: ${key}`)
          return caches.delete(key)
        })
    )
  }

  updateByBundleName(name: string): Promise<void> {
    console.log(`[worker] update bundle by bundle name: ${name}`)
    const bundle = this.bundleMap.get(name)
    if (!bundle) {
      throw new Error(`Bundle ${name} dose not exist`)
    }
    return this.updateBundle(bundle)
  }

  async updateByRoute(route: string): Promise<void> {
    console.log(`[worker] update bundle by route: ${route}`)
    await Promise.all(this.bundles.filter(bundle => bundle.matchRoute(route)).map(bundle => this.updateBundle(bundle)))
  }

  async getCachedResponse(
    request: Request
  ): Promise<{ response: Response; bundle: AssetsBundle; cache: Cache } | undefined> {
    const results = await Promise.all(
      this.bundles.map(async bundle => {
        const cache = await caches.open(this.getCachePrefix(bundle.name))
        const response = await cache.match(request)
        return {
          response,
          cache,
          bundle,
        }
      })
    )
    return results.find(({ response }) => Boolean(response)) as
      | { response: Response; bundle: AssetsBundle; cache: Cache }
      | undefined
  }

  getProgress(bundleNames: string[]): number {
    const bundles = bundleNames.map(name => this.bundleMap.get(name)).filter(Boolean) as AssetsBundle[]
    const totalCount = bundles.reduce((total, bundle) => total + bundle.files.length, 0)
    const loadedCount = bundles
      .map(bundle => this.progress.get(bundle)?.size as number)
      .filter(Boolean)
      .reduce((total, count) => total + count, 0)
    return loadedCount / totalCount
  }

  private getCachePrefix(name: string): string {
    return `bundle_${CACHE_VERSION}_${name}`
  }

  private getFileUri(file: string): string {
    return (self.__ASSETS_LOADER_MANIFEST ?? {})[file] ?? file
  }

  private async updateBundle(bundle: AssetsBundle): Promise<void> {
    if (this.lock.get(bundle)) {
      throw new Error('Loading process has already started')
    }
    this.lock.set(bundle, true)

    this.progress.delete(bundle)
    console.log(`[worker] update bundle: ${bundle.name}`)
    this.onUpdateBundle(bundle)

    try {
      const cache = await caches.open(this.getCachePrefix(bundle.name))

      if (!this.progress.has(bundle)) {
        this.progress.set(bundle, new Set())
      }

      const fileSet = this.progress.get(bundle) as Set<string>

      await Promise.all(
        bundle.files.map(async file => {
          const uri = this.getFileUri(file)
          const matched = await cache.match(new URL(uri, baseUrl))
          if (matched) {
            console.log(`[worker] already cached: ${file}`)
            return
          }

          console.log(`[worker] download: ${file}` + (uri === file ? '' : ' (' + uri + ')'))

          try {
            await cache.add(uri)
            this.onFileLoaded(bundle, file)
          } catch (err) {
            console.warn(`[worker] failed to download ${file}` + (uri === file ? '' : ' (' + uri + ')'), err)
            this.onFileLoaded(bundle, file, err as Error)
          } finally {
            fileSet.add(file)
          }
        })
      )
    } finally {
      this.lock.delete(bundle)
    }
  }
}
