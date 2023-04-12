// ui scripts are allowed to import this file

export const CACHE_VERSION = 'v4'

export enum BundleName {
  Basic = 'basic',
  HomePage = 'home-page',
  FoundryPage = 'foundry-page',
  AdventurePage = 'adventure-page',
}

export enum EventType {
  // response
  Error = 'error',
  FileLoaded = 'file-loaded',
  DownloadProgress = 'download-progress',
  UpdateBundle = 'update-bundle',

  // request
  SkipWaiting = 'SKIP_WAITING',
  UpdateBundleByNames = 'update-bundle-by-name',
  GetDownloadProgress = 'get-download-progress',
}
