export enum BannerType {
  AdBanner = 'AdBanner',
  HomePageSmallAd = 'HomePageSmallAd',
  Leaderboard = 'Leaderboard',
}

export interface Banner {
  type: BannerType
  name: string
  image: string
  link: string
  openNewTab?: boolean
}
