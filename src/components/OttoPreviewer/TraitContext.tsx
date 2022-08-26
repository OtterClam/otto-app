import noop from 'lodash/noop'
import { Trait } from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

const TraitContext = createContext<{ trait?: Trait; setTrait: (trait?: Trait) => void }>({
  setTrait: noop,
})

export const TraitProvider = ({ children }: PropsWithChildren<object>) => {
  const [trait, setTrait] = useState<Trait | undefined>(undefined)

  const value = useMemo(
    () => ({
      trait,
      setTrait,
    }),
    [trait]
  )

  return <TraitContext.Provider value={value}>{children}</TraitContext.Provider>
}

export const useTrait = () => useContext(TraitContext)
