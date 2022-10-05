import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventureOtto, AdventureOttoStatus } from 'models/AdventureOtto'
import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useCallback, useMemo } from 'react'
import useMyItems from './useMyItems'

export default function useIsWearable(): (itemId?: string, currentOttoId?: string) => boolean {
  const { ottos } = useAdventureOttos()

  const { items } = useMyItems()

  const { ottos: myOttos } = useMyOttos()

  const ongoingOttosMap = useMemo(() => {
    return ottos
      .filter(otto => otto.status === AdventureOttoStatus.Ongoing)
      .reduce(
        (map, otto) =>
          Object.assign(map, {
            [otto.id]: otto,
          }),
        {} as { [k: string]: AdventureOtto }
      )
  }, [ottos])

  return useCallback(
    (itemId?: string): boolean => {
      if (!itemId) {
        return true
      }

      const itemAmount = items.filter(item => !item.equipped).find(item => item.id === itemId)?.amount ?? 0

      const myOngoingOttosWithItem = myOttos
        .filter(otto => ongoingOttosMap[otto.tokenId])
        .filter(otto => otto.wearableTraits.find(trait => trait.id === itemId))

      const avaliableAmount = itemAmount - myOngoingOttosWithItem.length

      return avaliableAmount > 0
    },
    [ongoingOttosMap]
  )
}
