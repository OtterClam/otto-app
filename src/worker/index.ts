/* eslint-disable no-restricted-globals */

import { RegExpRoute, registerRoute, setDefaultHandler } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { RouteHandlerCallbackOptions } from 'workbox-core/types'
import { CacheController } from './cache-controller'
import { BundleName, EventType } from './consts'
import { WorkerMessageEvent } from './event'
import { bundles } from './assets-bundles'
import { broadcast } from './broadcast'
import { BundleRouteHandler } from './bundle-route-handler'

type RouteHandlerCallback = (options: RouteHandlerCallbackOptions) => Promise<Response>

const LARGE_FILE_SIZE_THRESHOLD = 2500000
const IMAGES_MAX_ENTRIES = 200
const FONTS_MAX_ENTRIES = 10
const CACHE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

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

const handleSkipWaiting = () => {
  console.log('[worker] skip waiting')
  self.skipWaiting()
}

const handleUpdateBundleByNames = (event: WorkerMessageEvent<string[]>) => {
  event.data.data.forEach(name => cacheController.updateByBundleName(name))
}

const handleGetDownloadProgress = (event: WorkerMessageEvent<string[]>) => {
  event.source?.postMessage({
    type: EventType.DownloadProgress,
    data: cacheController.getProgress(event.data.data),
  })
}

const eventHandlers: Record<string, (event: WorkerMessageEvent<any>) => void> = {
  [EventType.SkipWaiting]: handleSkipWaiting,
  [EventType.UpdateBundleByNames]: handleUpdateBundleByNames,
  [EventType.GetDownloadProgress]: handleGetDownloadProgress,
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

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('message', event => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[worker] service worker receive `message` event', event)
  }
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

setDefaultHandler(BundleRouteHandler.create(cacheController))

registerRoute(new RegExpRoute(/\/locales\/.*\.json/, new StaleWhileRevalidate()))

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: IMAGES_MAX_ENTRIES,
        maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
      }),
    ],
    matchOptions: {
      ignoreSearch: true,
    },
  }),
  'GET'
)

registerRoute(
  /\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)

registerRoute(
  /\.(?:woff|woff2|eot|ttf|otf)$/,
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: FONTS_MAX_ENTRIES,
        maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
      }),
    ],
  })
)

registerRoute(
  /\.mp3$/,
  new CacheFirst({
    cacheName: 'audio',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
  'GET'
)
