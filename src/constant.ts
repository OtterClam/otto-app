export const WHITELIST_MINT_TIME = 1647694800000 // 2022/3/19 21:00+8

export const PUBLIC_MINT_TIME = 1647781200000 // 2022/3/20 21:00+8

export const WHITE_PAPER_LINK = 'https://docs.ottopia.app/ottopia/'

export const BUY_CLAM_LINK =
  'https://quickswap.exchange/#/swap?outputCurrency=0xC250e9987A032ACAC293d838726C511E6E1C029d'

export const DAO_LINK = 'https://discord.gg/hygVspKCBf'

export const TREASURY_LINK = 'https://app.otterclam.finance'

export const DISCORD_LINK = 'https://discord.gg/otterclam'

export const TWITTER_LINK = 'https://twitter.com/otterclam'

export const OPENSEA_NFT_LINK = 'https://opensea.io/assets/matic/0x6e8a9cb6b1e73e9fce3fd3c68b5af9728f708eb7/'

export function getOpenSeaLink(tokenId: string) {
  return `${OPENSEA_NFT_LINK}${tokenId}`
}

export const ottoClick = new Audio('https://ottopia.app/ottoclick.mp3')
ottoClick.load()

export const TOTAL_RARITY_REWARD = 10000
