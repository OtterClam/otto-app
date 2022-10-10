import noop from 'lodash/noop'
import { Trait } from 'models/Otto'
import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react'

const TraitContext = createContext<{ traitType?: string; setTraitType: (type?: string) => void }>({
  setTraitType: noop,
})

export const TraitProvider = ({ children }: PropsWithChildren<object>) => {
  const [traitType, setTraitType] = useState<string | undefined>(undefined)

  const value = useMemo(
    () => ({
      traitType,
      setTraitType,
    }),
    [traitType]
  )

  return <TraitContext.Provider value={value}>{children}</TraitContext.Provider>
}

export const useTrait = () => useContext(TraitContext)

export function withTrait<P>(Component: FC<P>): FC<P> {
  return (props: P) => (
    <TraitProvider>
      <Component {...props} />
    </TraitProvider>
  )
}
