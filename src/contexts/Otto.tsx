import noop from 'lodash/noop'
import Otto, { Trait } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const OttoContext = createContext<{
  otto?: Otto
  setOtto: (otto?: Otto) => void
  loading: boolean
  resetEquippedItems: () => void
  equipItem: (trait: Trait) => void
  equippedItems: Trait[]
  reload: () => Promise<void>
}>({
  setOtto: noop,
  loading: true,
  resetEquippedItems: noop,
  equipItem: noop,
  equippedItems: [],
  reload: () => Promise.resolve(),
})

export function withOtto<P>(Component: FC<P>): FC<P> {
  return props => (
    <OttoProvider>
      <Component {...props} />
    </OttoProvider>
  )
}

export function OttoProvider({ children }: PropsWithChildren<object>) {
  const { ottos, loading, reload } = useMyOttos()
  const [initialized, setInitialized] = useState(false)
  const [otto, setOtto] = useState<Otto | undefined>()
  const [equippedItems, setEquippedItems] = useState<Trait[]>([])

  const equipItem = useCallback((trait: Trait) => {
    setEquippedItems(equippedItems => {
      const traits = equippedItems.filter(currTrait => currTrait.type !== trait.type)
      traits?.push(trait)
      return traits
    })
  }, [])

  const resetEquippedItems = useCallback(() => {
    setEquippedItems([])
  }, [])

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    if (!loading) {
      setInitialized(true)
    }
  }, [loading])

  useEffect(() => {
    if (!otto && ottos.length > 0) {
      setOtto(ottos[0])
    }
  }, [ottos])

  useEffect(() => {
    resetEquippedItems()
  }, [otto])

  const value = useMemo(
    () => ({
      otto,
      setOtto,
      loading: !initialized || loading,
      equipItem,
      resetEquippedItems,
      equippedItems,
      reload,
    }),
    [loading, initialized, otto, equippedItems]
  )

  return <OttoContext.Provider value={value}>{children}</OttoContext.Provider>
}

export const useOtto = () => useContext(OttoContext)
