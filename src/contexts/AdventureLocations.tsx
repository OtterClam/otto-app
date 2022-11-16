import throttle from 'lodash/throttle'
import noop from 'lodash/noop'
import { AdventureLocation } from 'models/AdventureLocation'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import usePreloadImages from 'hooks/usePreloadImage'
import { useApi } from './Api'

const defaultValue = {
  refetch: noop,
  loading: false,
  locations: [],
  idMap: {},
}

const AdventureLocationsContext = createContext<{
  refetch: () => void
  loading: boolean
  locations: AdventureLocation[]
  idMap: { [k: string]: AdventureLocation }
}>(defaultValue)

export const AdventureLocationsProvider = ({ children }: PropsWithChildren<object>) => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [locations, steLocations] = useState<AdventureLocation[]>([])
  const images = useMemo(() => {
    const images: string[] = []
    locations.forEach(location => {
      images.push(location.image)
      images.push(location.bgImage)
      images.push(location.bgImageBlack)
    })
    return images
  }, [locations])

  usePreloadImages(images)

  const refetch = useCallback(
    throttle(() => {
      setLoading(true)
      api
        .getAdventureLocations()
        .then(steLocations)
        .finally(() => setLoading(false))
    }, 500),
    [api]
  )

  const value = useMemo(
    () => ({
      loading,
      locations,
      refetch,
      idMap: locations.reduce(
        (map, location) =>
          Object.assign(map, {
            [location.id]: location,
          }),
        {}
      ),
    }),
    [loading, locations]
  )

  useEffect(refetch, [api])

  return <AdventureLocationsContext.Provider value={value}>{children}</AdventureLocationsContext.Provider>
}

export const useAdventureLocations = () => {
  return useContext(AdventureLocationsContext)
}

export const useAdventureLocation = (id?: number): AdventureLocation | undefined => {
  const { idMap } = useAdventureLocations()
  if (!id) {
    return
  }
  return idMap[id]
}
