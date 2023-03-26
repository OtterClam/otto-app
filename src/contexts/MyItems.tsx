import { useEthers } from '@usedapp/core'
import noop from 'lodash/noop'
import { Item } from 'models/Item'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRepositories } from './Repositories'

const MyItemsContext = createContext<{
  items: Item[]
  idToItem: { [k: string]: Item }
  loading: boolean
  fetchAccountItems: () => void
}>({
  items: [],
  idToItem: {},
  loading: false,
  fetchAccountItems: noop,
})

export const MyItemsProvider = ({ children }: PropsWithChildren<object>) => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const { account } = useEthers()
  const { items: itemsRepo } = useRepositories()

  const fetchAccountItems = useCallback(() => {
    if (!account) {
      setLoading(false)
      setItems([])
      return
    }
    setLoading(true)
    console.log('refetching all account items')
    itemsRepo
      .getAllItemsByAccount(account)
      .then(setItems)
      .catch(err => {
        console.error('failed getAllItemsByAccount', err.message)
      })
      .finally(() => setLoading(false))
  }, [itemsRepo, account])

  useEffect(() => {
    if (!items || !items.length) {
      fetchAccountItems()
    }
  }, [items, fetchAccountItems])

  const value = useMemo(() => {
    return {
      items,
      idToItem: items.reduce((map, item) => {
        map[item.id] = item
        return map
      }, {} as { [id: string]: Item }),
      loading,
      fetchAccountItems,
    }
  }, [items, loading, fetchAccountItems])

  return <MyItemsContext.Provider value={value}>{children}</MyItemsContext.Provider>
}

export const useMyItems = () => useContext(MyItemsContext)

export const useMyItem = (id?: string): Item | undefined => {
  const { idToItem } = useMyItems()
  return idToItem[id ?? '']
}
