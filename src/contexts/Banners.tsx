import usePreloadImages from 'hooks/usePreloadImage'
import { Banner, BannerType } from 'models/Banner'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

const BannersContext = createContext<Banner[]>([])

export const BannersProvider = ({ children }: PropsWithChildren<object>) => {
  const [banners, setBanners] = useState<Banner[]>([])

  const images = useMemo(() => banners.map(({ image }) => image).filter(Boolean), [banners])

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(setBanners)
  }, [])

  usePreloadImages(images)

  return <BannersContext.Provider value={banners}>{children}</BannersContext.Provider>
}

export const useBanners = (types?: BannerType[]): Banner[] => {
  const banners = useContext(BannersContext)

  return useMemo(() => {
    if (!types) {
      return banners
    }
    return banners.filter(banner => types.includes(banner.type))
  }, [types, banners])
}
