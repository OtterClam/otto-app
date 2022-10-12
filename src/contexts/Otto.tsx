import { ItemActionType } from 'constant'
import useMyItems from 'hooks/useMyItems'
import noop from 'lodash/noop'
import Item, { ItemAction } from 'models/Item'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

const OttoContext = createContext<{
  otto?: Otto
  setOtto: (otto?: Otto) => void
  resetEquippedItems: () => void
  equipItem: (traitType: string, traitId: string) => void
  removeItem: (traitType: string) => void
  itemActions: ItemAction[]
}>({
  setOtto: noop,
  resetEquippedItems: noop,
  equipItem: noop,
  removeItem: noop,
  itemActions: [],
})

export function withOtto<P>(Component: FC<P>): FC<P> {
  return props => (
    <OttoProvider>
      <Component {...props} />
    </OttoProvider>
  )
}

export function OttoProvider({ children }: PropsWithChildren<object>) {
  const { ottos } = useMyOttos()
  const { items } = useMyItems()
  const [otto, setOtto] = useState<Otto | undefined>()
  const [draftItems, setDraftItems] = useState<{
    [traitType: string]: string | null
  }>({})

  useEffect(() => {
    setDraftItems({})
  }, [otto])

  const value = useMemo(() => {
    const equippedItems = items
      .filter(item => item.equipped)
      .reduce((map, item) => Object.assign(map, { [item.type]: item }), {} as { [k: string]: Item })
    const ottoIdToOtto = ottos.reduce(
      (map, otto) => Object.assign(map, { [otto.id]: otto }),
      {} as { [k: string]: Otto }
    )
    const equippedItemToOtto = ottos
      .filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready)
      .map(({ id }) => ottoIdToOtto[id])
      .filter(Boolean)
      .map(otto =>
        otto.wearableTraits.reduce(
          (map, trait) => Object.assign(map, { [trait.id]: otto }),
          {} as { [k: string]: Otto }
        )
      )
      .reduce((all, map) => Object.assign(all, map), {} as { [k: string]: Otto })

    const ottoItems = (otto?.wearableTraits ?? []).reduce(
      (map, trait) => Object.assign(map, { [trait.type]: trait.id }),
      {} as { [k: string]: string }
    )

    const cleanedDraftItems = Object.keys(draftItems).reduce(
      (items, type) => {
        if (items[type] !== null && ottoItems[type] === items[type]) {
          delete items[type]
        } else if (items[type] === null && !ottoItems[type]) {
          delete items[type]
        }
        return items
      },
      { ...draftItems }
    )

    const actions = !otto
      ? []
      : Object.keys(cleanedDraftItems).map(type => {
          const itemId = cleanedDraftItems[type]

          if (itemId === null) {
            return {
              type: ItemActionType.TakeOff,
              item_id: Number(ottoItems[type]),
            }
          }

          if (equippedItems[itemId]) {
            return {
              type: ItemActionType.EquipFromOtto,
              item_id: Number(itemId),
              from_otto_id: Number(equippedItemToOtto[itemId].id),
            }
          }

          return {
            type: ItemActionType.Equip,
            item_id: Number(itemId),
          }
        })

    return {
      otto,
      setOtto,
      equipItem: (traitType: string, traitId: string) => {
        setDraftItems(map => {
          return {
            ...map,
            [traitType]: traitId,
          }
        })
      },
      removeItem: (traitType: string) => {
        setDraftItems(map => {
          const newMap = { ...map }
          if (newMap[traitType]) {
            newMap[traitType] = null
          } else {
            delete newMap[traitType]
          }
          return newMap
        })
      },
      resetEquippedItems: () => {
        setDraftItems({})
      },
      itemActions: actions,
    }
  }, [otto, draftItems, items])

  return <OttoContext.Provider value={value}>{children}</OttoContext.Provider>
}

export const useOtto = () => useContext(OttoContext)
