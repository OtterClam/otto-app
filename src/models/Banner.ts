export enum BannerType {
  AdBanner = 'AdBanner',
  HomePageSmallAd = 'HomePageSmallAd',
  LeaderboardSub = 'LeaderboardSub',
  LeaderboardMain = 'LeaderboardMain',
}

export interface Banner {
  type: BannerType
  name: string
  image: string
  link: string
  openNewTab?: boolean
}
