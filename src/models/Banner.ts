export enum BannerType {
  AdBanner = 'AdBanner',
  HomePageSmallAd = 'HomePageSmallAd',
}

export interface Banner {
  type: BannerType
  name: string
  image: string
  link: string
  openNewTab?: boolean
}
