import { IS_SERVER } from 'constant'
import EventEmitter from 'events'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { WorkboxMessageEvent } from 'workbox-window'
import { BundleName, EventType } from '../worker/consts'

export interface AssetsLoaderState {
  bundleNames: string[]
  loadingProgress: number
}

export class AssetsLoader extends EventEmitter {
  private bundleNames: string[] = []

  private loadingProgress = 1

  init() {
    console.log('[assets-loader] init')
    window.workbox.addEventListener('message', this.messageHandler)
  }

  destroy() {
    console.log('[assets-loader] destroy')
    window.workbox.removeEventListener('message', this.messageHandler)
  }

  private messageHandler = (event: WorkboxMessageEvent) => {
    console.log('[assets-loader] receive event', event)
    if (event.data.type === EventType.FileLoaded && this.bundleNames.includes(event.data.data.bundleName)) {
      this.updateLoadingProgress()
    }
    if (event.data.type === EventType.DownloadProgress) {
      console.log(`[assets-loader] update loading progress: ${event.data.data}`)
      this.loadingProgress = event.data.data
      this.emit('progress', this.loadingProgress)
    }
  }

  watch(bundleNames: string[]) {
    this.bundleNames = bundleNames
  }

  async loadBundleByNames(names: BundleName[]): Promise<void> {
    if (!window.workbox) {
      return
    }

    this.removeAllListeners('progress')
    console.log(`[assets-loader] load bundles: ${names}`)
    window.workbox.messageSW({
      type: EventType.UpdateBundleByNames,
      data: [BundleName.Basic].concat(names),
    })
  }

  async updateLoadingProgress(): Promise<void> {
    if (!window.workbox) {
      return
    }

    console.log(`[assets-loader] update loading progress...`, this.bundleNames)
    window.workbox.messageSW({
      type: EventType.GetDowbloadProgress,
      data: this.bundleNames,
    })
  }
}

const AssetsLoaderContext = createContext<AssetsLoader>(new AssetsLoader())

export const AssetsLoaderProvider = ({ children }: PropsWithChildren<object>) => {
  const [assetsLoader] = useState(() => new AssetsLoader())

  useEffect(() => {
    if (IS_SERVER) {
      return
    }

    if (!window.workbox) {
      return
    }

    assetsLoader.init()
    return () => assetsLoader.destroy()
  }, [])

  return <AssetsLoaderContext.Provider value={assetsLoader}>{children}</AssetsLoaderContext.Provider>
}

export const useAssetsLoader = () => {
  return useContext(AssetsLoaderContext)
}
