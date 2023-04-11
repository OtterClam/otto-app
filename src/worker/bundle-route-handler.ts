import { RouteHandlerCallbackOptions, RouteHandlerObject } from 'workbox-core'
import { CacheController } from './cache-controller'

export class BundleRouteHandler implements RouteHandlerObject {
  private readonly controller: CacheController

  private constructor(controller: CacheController) {
    this.controller = controller
  }

  static create(controller: CacheController): BundleRouteHandler {
    return new BundleRouteHandler(controller)
  }

  async handle({ url, request, event }: RouteHandlerCallbackOptions): Promise<Response> {
    const { response, cache } = (await this.controller.getCachedResponse(request)) ?? {}

    if (response) {
      console.log(`[worker] cache hit: ${url}`)
      event.waitUntil(cache?.add(request))
      return response
    }

    return fetch(request)
  }
}
