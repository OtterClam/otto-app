import { useEthers } from '@usedapp/core'
import { Api, defaultApi } from 'libs/api'
import { useTranslation } from 'next-i18next'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ApiContext = createContext<Api>(defaultApi)

export function ApiProvider({ children }: PropsWithChildren<object>) {
  const { i18n } = useTranslation()
  const { chainId } = useEthers()

  const api = useMemo(() => {
    if (!chainId) {
      return defaultApi
    }
    return new Api(chainId)
  }, [chainId])

  useEffect(() => {
    api.setLanguage(i18n.resolvedLanguage)
  }, [i18n.resolvedLanguage, api])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

type ApiMethod = {
  [K in keyof Api]-?: Api[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof Api]

export const useApi = () => useContext(ApiContext)

export function useApiCall<M extends ApiMethod>(methodName: M, args: Parameters<Api[M]>, when: boolean, deps: any[]) {
  const api = useApi()
  const [controller, setController] = useState<AbortController | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Awaited<ReturnType<Api[M]>> | undefined>(undefined)
  const [err, setErr] = useState<Error | undefined>(undefined)

  const fetch: () => Promise<void> = useCallback(() => {
    if (controller) {
      controller.abort()
    }

    const newController = new AbortController()
    const cancelableApi = api.withAbortController(newController)
    const method = cancelableApi[methodName] as any

    setLoading(true)
    setController(newController)

    return method
      .call(cancelableApi, ...args)
      .then(setResult)
      .catch(setErr)
      .finally(() => setLoading(false))
  }, [api, controller, methodName].concat(deps))

  useEffect(() => {
    if (!when) {
      return
    }
    fetch()
  }, [when, api, methodName].concat(deps))

  return useMemo(
    () => ({
      loading,
      result,
      err,
      refetch: fetch,
    }),
    [loading, result]
  )
}
