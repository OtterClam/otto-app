import { DependencyList, EffectCallback, useEffect } from 'react'

const useDebouncedEffect = (effect: EffectCallback, deps: DependencyList, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay)
    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay])
}

export default useDebouncedEffect
