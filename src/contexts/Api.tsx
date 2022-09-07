import { ChainId, useEthers } from '@usedapp/core'
import { Api, defaultApi } from 'libs/api'
import { useTranslation } from 'next-i18next'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'

const ApiContext = createContext<Api>(defaultApi)

export function ApiProvider({ children }: PropsWithChildren<object>) {
  const { i18n } = useTranslation()
  const { chainId } = useEthers()

  const api = useMemo(() => {
    if (!chainId) {
      return new Api(ChainId.Polygon, i18n.resolvedLanguage)
    }
    return new Api(chainId, i18n.resolvedLanguage)
  }, [chainId, i18n.resolvedLanguage])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export const useApi = () => useContext(ApiContext)
