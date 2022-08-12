import { ChainId, useEthers } from '@usedapp/core'
import { Api } from 'libs/api'
import { useTranslation } from 'next-i18next'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'

const ApiContext = createContext<Api>(new Api(ChainId.Polygon))

export function ApiProvider({ children }: PropsWithChildren<object>) {
  const { i18n } = useTranslation()
  const { chainId } = useEthers()

  const api = useMemo(() => {
    return new Api(chainId ?? ChainId.Polygon)
  }, [chainId])

  useEffect(() => {
    api.setLanguage(i18n.resolvedLanguage)
  }, [i18n.resolvedLanguage, api])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export const useApi = () => useContext(ApiContext)
