import { gql, useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import Item from 'models/Item'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ListItems, ListItemsVariables } from './__generated__/ListItems'
import useApi from './useApi'

const LIST_MY_ITEMS = gql`
  query ListItems($owner: Bytes!) {
    ottoItems(where: { rootOwner: $owner, amount_gt: 0 }, first: 1000) {
      tokenId
      amount
      parentTokenId
      updateAt
    }
  }
`

export default function useMyItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const api = useApi()
  const { i18n } = useTranslation()
  const { account } = useEthers()
  const { data, refetch } = useQuery<ListItems, ListItemsVariables>(LIST_MY_ITEMS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  useEffect(() => {
    if (data) {
      const ids = data.ottoItems.map(item => String(item.tokenId))
      api
        .getItems(ids, i18n.resolvedLanguage)
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
        .then(() => setLoading(false))
    }
  }, [data])
  return {
    items,
    loading,
    refetch: () => {
      setLoading(true)
      refetch()
    },
  }
}
