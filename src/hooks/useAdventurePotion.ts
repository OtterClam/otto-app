import { AdventurePotion } from 'constant'
import { useMyItems } from 'contexts/MyItems'
import { useItem } from 'contracts/functions'
import { useCallback, useEffect, useMemo, useState } from 'react'

const potionIds = Object.values(AdventurePotion)
const potionIdMap = potionIds.reduce(
  (map, posionId) => Object.assign(map, { [posionId]: true }),
  {} as { [k: string]: boolean }
)

export default function useAdventurePotion() {
  const [loading, setLoading] = useState(false)
  const { items, loading: loadingMyItems, refetch: refetchMyItems } = useMyItems()

  const { use, useItemState } = useItem()

  const amounts = useMemo(() => {
    const amounts = {} as { [k: string]: number }
    items.forEach(item => {
      if (potionIdMap[item.metadata.tokenId]) {
        amounts[item.metadata.tokenId] = item.amount
      }
    })
    return amounts
  }, [items])

  const usePotion = useCallback(
    (potion: AdventurePotion, ottoId: string) => {
      if ((amounts[potion] ?? 0) > 0) {
        setLoading(true)
        use(String(potion), ottoId)
      }
    },
    [amounts, use]
  )

  useEffect(() => {
    if (useItemState.state === 'Success') {
      refetchMyItems()
    }
    setLoading(useItemState.state === 'PendingSignature' || useItemState.state === 'Mining')
  }, [useItemState.state, refetchMyItems])

  return {
    amounts,
    usePotion,
    loading: loading || loadingMyItems,
  }
}
