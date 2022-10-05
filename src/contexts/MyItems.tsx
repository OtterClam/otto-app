import useMyItemsHook from 'hooks/useMyItems'
import noop from 'lodash/noop'
import Item from 'models/Item'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const MyItemsContext = createContext<{
  items: Item[]
  loading: boolean
  refetch: () => void
}>({
  items: [],
  loading: false,
  refetch: noop,
})

export const MyItemsProvider = ({ children }: PropsWithChildren<object>) => {
  const { items, loading, refetch } = useMyItemsHook()

  const value = useMemo(() => {
    return {
      items,
      loading,
      refetch,
    }
  }, [items, loading, refetch])

  return <MyItemsContext.Provider value={value}>{children}</MyItemsContext.Provider>
}

export const useMyItems = () => useContext(MyItemsContext)
