import { useEthers } from '@usedapp/core'
import { Api, defaultApi } from 'libs/api'
import { useTranslation } from 'next-i18next'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'

const ApiContext = createContext<Api>(defaultApi)

export function ApiProvider({ children }: PropsWithChildren<object>) {
  const { i18n } = useTranslation()
  const { chainId } = useEthers()

  const api = useMemo(() => {
    if (!chainId) {
      return defaultApi
    }
    return new Api(chainId, i18n.resolvedLanguage)
  }, [chainId, i18n.resolvedLanguage])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

type ApiMethod = {
  [K in keyof Api]-?: Api[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof Api]

export const useApi = () => useContext(ApiContext)

/**
 * Use API Call - Returns callback that can be used to trigger the fetch, along with
 * associated reactive state variables.
 *
 * @param methodName Method name
 * @param args Method arguments - This is used as an effect dependency,
 *  so if generated on the fly (new array), it needs to be wrapped with
 *  useMemo or it should be non-reactive (e.g. constant).
 * @returns Fetch callback, loading status, result if present, error if present.
 */
export function useApiCall<M extends ApiMethod>(methodName: M, args: Parameters<Api[M]>) {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Awaited<ReturnType<Api[M]>> | undefined>(undefined)
  const [err, setErr] = useState<Error | undefined>(undefined)

  const fetch: () => Promise<void> = useCallback(() => {
    setLoading(true)
    return (api[methodName] as any)(...args)
      .then(setResult)
      .catch(setErr)
      .finally(() => setLoading(false))
  }, [api, args, methodName])

  return useMemo(
    () => ({
      fetch,
      loading,
      result,
      err,
    }),
    [fetch, loading, result, err]
  )
}
