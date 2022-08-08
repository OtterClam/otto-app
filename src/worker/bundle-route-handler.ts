import { RouteHandlerCallbackOptions, RouteHandlerObject } from 'workbox-core'
import { CacheController } from './cache-controller'

export class BundleRouteHandler implements RouteHandlerObject {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly controller: CacheController) {}

  async handle({ url, request, event }: RouteHandlerCallbackOptions): Promise<Response> {
    const result = await this.controller.getCachedResponse(request)

    if (result) {
      console.log(`[worker] cache hit: ${url}`)
      // update resource
      event.waitUntil(result.cache.add(request))
      return result.response
    }

    return fetch(request)
  }
}
