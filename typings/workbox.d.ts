export {}

declare global {
  interface Window {
    __WB_MANIFEST: any
    __WB_DISABLE_DEV_LOGS: boolean
    workbox: import('workbox-window').Workbox
  }
}
