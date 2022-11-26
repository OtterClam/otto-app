import { Banner, BannerType } from 'models/Banner'
import { useEffect, useState } from 'react'

export default function SmallAdBanner() {
  const [ads, setAds] = useState<Banner[]>([])

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => data.filter(({ type }: Banner) => type === BannerType.HomePageSmallAd))
      .then(setAds)
  }, [])
}
