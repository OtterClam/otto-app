import noop from 'lodash/noop'

export const IS_SERVER = typeof window === 'undefined'

export const WHITELIST_MINT_TIME = 1647694800000 // 2022/3/19 21:00+8

export const PUBLIC_MINT_TIME = 1647781200000 // 2022/3/20 21:00+8

export const WHITE_PAPER_LINK = 'https://docs.ottopia.app/ottopia/'

export const DAO_LINK = 'https://snapshot.org/#/otterclam.eth'

export const TREASURY_LINK = '/treasury/dashboard'

export const DISCORD_LINK = 'https://discord.gg/otterclam'

export const TWITTER_LINK = 'https://twitter.com/otterclam'

export const YOUTUB_LINK = 'https://www.youtube.com/channel/UCDDMx916FeqHmCilGr5WuQw/video'

export const MEDIUM_LINK = 'https://medium.com/@ottercla'

export const GITHUB_LINK = 'https://github.com/ottercla'

export const TELEGRAM_LINK = 'https://t.me/otterclam_official'

export const OPENSEA_NFT_LINK = 'https://opensea.io/assets/matic/0x6e8a9cb6b1e73e9fce3fd3c68b5af9728f708eb7/'

export function getOpenSeaLink(tokenId: string) {
  return `${OPENSEA_NFT_LINK}${tokenId}`
}

export const ottoClick = IS_SERVER ? { play: noop, load: noop } : new Audio('https://ottopia.app/ottoclick.mp3')
ottoClick.load()

export const TOTAL_RARITY_REWARD = 16000
export const ROUND_RARITY_REWARD_BEFORE_3 = 2500
export const ROUND_RARITY_REWARD_AFTER_3 = 3000
export const RARITY_S1_END = 1660867200000

export enum Token {
  Clam = 'CLAM',
}

export const reserveOttoAmount = (chainId?: number) => (chainId === 137 ? 250 : 0)
