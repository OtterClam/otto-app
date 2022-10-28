import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Repositories } from 'repositories'
import { useApi } from './Api'

const RepositoriesContext = createContext<Repositories | undefined>(undefined)

export const RepositoriesProvider = ({ children }: PropsWithChildren<object>) => {
  const api = useApi()
  const ottoSubgraph = useApolloClient()

  const repositories = useMemo(() => {
    return new Repositories({
      api,
      ottoSubgraph,
    })
  }, [api, ottoSubgraph])

  return <RepositoriesContext.Provider value={repositories}>{children}</RepositoriesContext.Provider>
}

export const useRepositories = (): Repositories => {
  const repositories = useContext(RepositoriesContext)
  if (!repositories) {
    throw new Error('No RepositoriesProvider found when calling useRepositories.')
  }
  return repositories
}
