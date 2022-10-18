import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { useApi } from 'contexts/Api'
import { LIST_MY_ITEMS } from 'graphs/otto'
import { ListItems, ListItemsVariables } from 'graphs/__generated__/ListItems'
import Item from 'models/Item'
import { useState } from 'react'

export default function useMyItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const api = useApi()
  const { account } = useEthers()
  const { refetch } = useQuery<ListItems, ListItemsVariables>(LIST_MY_ITEMS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: { owner: account || '' },
    skip: !account,
    onCompleted: data => {
      const ids = (data?.ottoItems ?? []).map(item => String(item.tokenId))
      api
        .getItems(ids)
        .then(items =>
          items.map((item, i) => ({
            ...item,
            amount: data.ottoItems[i].amount,
            equipped: Boolean(data.ottoItems[i].parentTokenId),
            parentTokenId: data.ottoItems[i].parentTokenId?.toString(),
            update_at: data.ottoItems[i].updateAt,
          }))
        )
        .then(items => setItems(items))
        .finally(() => setLoading(false))
    },
  })

  return {
    items: loading ? [] : items,
    loading,
    refetch() {
      setLoading(true)
      refetch()
    },
  }
}
