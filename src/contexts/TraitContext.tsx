import noop from 'lodash/noop'
import { Trait } from 'models/Otto'
import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react'

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

export function withTrait<P>(Component: FC<P>): FC<P> {
  return (props: P) => (
    <TraitProvider>
      <Component {...props} />
    </TraitProvider>
  )
}
