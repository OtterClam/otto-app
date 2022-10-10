import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventureOtto, AdventureOttoStatus } from 'models/AdventureOtto'
import Item from 'models/Item'
import { useMyOttos } from 'MyOttosProvider'
import { useCallback, useMemo } from 'react'

export default function useIsWearable(items: Item[]): (itemId?: string, currentOttoId?: string) => boolean {
  const { ottos } = useAdventureOttos()

  const { ottos: myOttos } = useMyOttos()

  const readyOttosMap = useMemo(() => {
    return ottos
      .filter(otto => otto.status === AdventureOttoStatus.Ready)
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

      const myReadyOttosWithItem = myOttos
        .filter(otto => readyOttosMap[otto.tokenId])
        .filter(otto => otto.wearableTraits.find(trait => trait.id === itemId))

      const avaliableAmount = itemAmount - myReadyOttosWithItem.length

      return avaliableAmount > 0
    },
    [readyOttosMap]
  )
}
