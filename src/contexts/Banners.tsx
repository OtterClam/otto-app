import usePreloadImages from 'hooks/usePreloadImage'
import { Banner, BannerType } from 'models/Banner'
import { useRouter } from 'next/router'
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

export const useAdventureBanners = () => {
  const banners = useBanners([BannerType.Leaderboard])
  const router = useRouter()

  return banners.map(banner => {
    const url = new URL(`https://whatever.com${banner.link}`)
    const bannerAdventure = Boolean(url.searchParams.get('adventure'))
    const bannerEpoch = url.searchParams.get('epoch') ?? '-1'
    const adventure = Boolean(router.query.adventure)
    const epoch = router.query.epoch ? String(router.query.epoch) : '-1'
    return {
      banner,
      active: router.pathname === '/leaderboard' && bannerAdventure === adventure && bannerEpoch === epoch,
    }
  })
}
