import { BigNumber } from 'ethers'
import noop from 'lodash/noop'

export const IS_SERVER = typeof window === 'undefined'

export const WHITELIST_MINT_TIME = 1647694800000 // 2022/3/19 21:00+8

export const PUBLIC_MINT_TIME = 1647781200000 // 2022/3/20 21:00+8

export const WHITE_PAPER_LINK = 'https://docs.ottopia.app/ottopia/'

export const DAO_LINK = 'https://snapshot.org/#/otterclam.eth'

export const TREASURY_LINK = '/treasury/palace'

export const DISCORD_LINK = 'https://discord.gg/otterclam'

export const TWITTER_LINK = 'https://twitter.com/otterclam'

export const YOUTUB_LINK = 'https://www.youtube.com/channel/UCDDMx916FeqHmCilGr5WuQw/video'

export const MEDIUM_LINK = 'https://medium.com/@otterclam'

export const GITHUB_LINK = 'https://github.com/otterclam'

export const TELEGRAM_LINK = 'https://t.me/otterclam_official'

export const OPENSEA_NFT_LINK = 'https://opensea.io/assets/matic/0x6e8a9cb6b1e73e9fce3fd3c68b5af9728f708eb7/'

export const MAX_OTTOS_PER_LOCATION = 5

export function getOpenSeaLink(tokenId: string) {
  return `${OPENSEA_NFT_LINK}${tokenId}`
}

export const OPENSEA_ITEM_LINK = 'https://opensea.io/assets/matic/0xBd29ee9a2cE0C794Eaf09BEdCa9387F4566377D5/'

export const getOpenSeaItemLink = (itemId: string) => `${OPENSEA_ITEM_LINK}${itemId}`

export const ottoClick = IS_SERVER ? { play: noop, load: noop } : new Audio('https://ottopia.app/ottoclick.mp3')
ottoClick.load()

export const TOTAL_RARITY_REWARD = 10000
export const ROUND_RARITY_REWARD_BEFORE_3 = 2500
export const ROUND_RARITY_REWARD_AFTER_3 = 3000
export const ROUND_RARITY_REWARD_S2 = 2500
export const RARITY_S1_END = 1660867200000

export enum Token {
  Clam = 'CLAM',
  Fish = 'FISH',
}

export const reserveOttoAmount = (chainId?: number) => (chainId === 137 ? 250 : 0)

export const BIG_NUM_ZERO = BigNumber.from(0)

export enum AdventurePotion {
  OneHourSpeedy = 16711718,
  ThreeHourSpeedy = 16711782,
  SixHourSpeedy = 16711816,
  Exp = 16711832,
  Str = 16711854,
}

export const AdventureSpeedUpTime: { [k: string]: number } = {
  [AdventurePotion.OneHourSpeedy]: 60 * 60 * 1000,
  [AdventurePotion.ThreeHourSpeedy]: 3 * 60 * 60 * 1000,
  [AdventurePotion.SixHourSpeedy]: 6 * 60 * 60 * 1000,
}

export enum ItemActionType {
  Equip = 0,
  Use = 1,
  TakeOff = 2,
  EquipFromOtto = 3,
}

export enum ChestId {
  TreasuryChest = '16646388',
  SilverChest = '16646144',
  GoldChest = '16646208',
  DiamondChest = '16646230',
}
