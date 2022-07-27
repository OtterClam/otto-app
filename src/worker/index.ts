/* eslint-disable no-restricted-globals */

import { RegExpRoute, registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheController } from './cache-controller'
import { BundleName, EventType } from './consts'
import { WorkerMessageEvent } from './event'
import { bundles } from './assets-bundles'
import { broadcast } from './broadcast'
import { BundleRouteHandler } from './bundle-route-handler'
import { StaleWhileRevalidate } from 'workbox-strategies'

// the following line can't be removed
self.__WB_MANIFEST
self.__WB_DISABLE_DEV_LOGS = true

const cacheController = new CacheController({
  bundles,
  onUpdateBundle: bundle => {
    broadcast(EventType.UpdateBundle, bundle.name)
  },
  onFileLoaded: (bundle, file, err) => {
    broadcast(EventType.FileLoaded, {
      bundleName: bundle.name,
      file,
      error: err?.message,
    })
  },
})

const eventHandlers: { [key: string]: (event: WorkerMessageEvent<any>) => void } = {
  [EventType.SkipWaiting]: () => {
    console.log('[worker] skip waiting')
    self.skipWaiting()
  },
  [EventType.UpdateBundleByNames]: (event: WorkerMessageEvent<string[]>) => {
    event.data.data.forEach(name => cacheController.updateByBundleName(name))
  },
  [EventType.GetDowbloadProgress]: (event: WorkerMessageEvent<string[]>) => {
    event.source?.postMessage({
      type: EventType.DownloadProgress,
      data: cacheController.getProgress(event.data.data),
    })
  },
}

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[worker] service worker receive `install` event', event)
  event.waitUntil(
    (async () => {
      await cacheController.clearOldCache()
      await cacheController.updateByBundleName(BundleName.Basic)
    })()
  )
})

self.addEventListener('message', event => {
  console.log('[worker] service worker receive `message` event', event)
  const { type } = (event as WorkerMessageEvent<any>).data ?? {}
  const handler = eventHandlers[type]

  if (!handler) {
    event.source?.postMessage({
      type: EventType.Error,
      data: `unknown event: ${type}`,
    })
    return
  }

  handler(event)
})

// workbox
setDefaultHandler(new BundleRouteHandler(cacheController))

registerRoute(new RegExpRoute(/\/locales\/.*\.json/, new StaleWhileRevalidate()))
