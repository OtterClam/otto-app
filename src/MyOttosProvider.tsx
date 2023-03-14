import { useEthers } from '@usedapp/core'
import { useRepositories } from 'contexts/Repositories'
import usePreloadImages from 'hooks/usePreloadImage'
import useTimer from 'hooks/useTimer'
import flatten from 'lodash/flatten'
import noop from 'lodash/noop'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
  idToOtto: { [id: string]: Otto }
  reload: () => Promise<void>
  updateOtto: (otto: Otto) => void
}

export const MyOttosContext = createContext<MyOttos>({
  loading: true,
  ottos: [],
  idToOtto: {},
  reload: () => {
    return Promise.resolve()
  },
  updateOtto: noop,
})

export function useMyOtto(id?: string) {
  const { ottos } = useMyOttos()
  return useMemo(() => ottos.find(otto => otto.id === id), [ottos, id])
}

export function useMyOttos() {
  return useContext(MyOttosContext)
}

export function useIsMyOttos(ottoTokenId?: string): boolean {
  const { idToOtto } = useMyOttos()
  return Boolean(idToOtto[ottoTokenId ?? ''])
}

// this component must to be wrapped by AdventureOttosProvider
export default function MyOttosProvider({ children }: PropsWithChildren<any>) {
  const { account } = useEthers()
  const { ottos: ottosRepo } = useRepositories()
  const [loading, setLoading] = useState(false)
  const [ottos, setOttos] = useState<Otto[]>([])
  const images = useMemo(() => flatten(ottos.map(({ image, imageWoBg }) => [image, imageWoBg])), [])

  usePreloadImages(images)

  const refetch = useCallback(() => {
    if (!account) {
      return Promise.resolve()
    }
    setLoading(true)
    return ottosRepo
      .getOttosByAccount(account)
      .then(setOttos)
      .catch(err => {
        console.error('failed to getOttosByAccount', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account])

  useEffect(() => {
    refetch()
  }, [account])

  const updateOtto = useCallback(
    (otto: Otto) => {
      const idx = ottos.findIndex(o => o.id === otto.id)
      if (idx >= 0) {
        ottos[idx] = otto.clone()
        setOttos([...ottos])
      } else {
        console.warn(`updateOtto: otto ${otto.id} not found`)
      }
    },
    [ottos]
  )

  const myOttos = useMemo(
    () => ({
      loading,
      ottos,
      idToOtto: ottos.reduce((map, otto) => Object.assign(map, { [otto.id]: otto }), {} as { [id: string]: Otto }),
      reload: refetch,
      updateOtto,
    }),
    [loading, ottos, refetch, updateOtto]
  )

  useTimer(() => {
    setOttos(ottos => {
      let updated = false
      const newOttos = ottos.map(otto => {
        if (otto.cachedAdventureStatus !== otto.adventureStatus) {
          updated = true
          return otto.clone()
        }
        return otto
      })
      return updated ? newOttos : ottos
    })
  }, 1000)

  return <MyOttosContext.Provider value={myOttos}>{children}</MyOttosContext.Provider>
}
