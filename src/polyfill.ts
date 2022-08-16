import { AbortController, abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill'

if (typeof window === 'undefined') {
  ;(global as any).AbortController = AbortController
  const { fetch: newFetch } = abortableFetch(fetch)
  global.fetch = newFetch
}
