import { Handler } from '@netlify/functions'
import { getApi } from 'libs/api'
import redis from '../libs/redis'

const handler: Handler = async event => {
  const { code, wallet, chainId } = JSON.parse(event.body || '{}')
  const discordToken = event.headers.authorization?.split(' ')[1] || ''
  const part = event.headers.cookie?.split('twitter_token=') || []
  if (part.length < 2) {
    return {
      statusCode: 401,
      body: 'Missing twitter token',
    }
  }
  const access_token_key = part[1].split(';')[0]
  const access_token_secret = (await redis.get(access_token_key)) || ''
  try {
    const axios = getApi(chainId)
    const res = await axios.post(
      '/giveaway/wallets',
      {
        code,
        wallet,
      },
      {
        headers: {
          'X-DISCORD-ACCESS-TOKEN': discordToken,
          'X-TWITTER-ACCESS-TOKEN-KEY': access_token_key,
          'X-TWITTER-ACCESS-TOKEN-SECRET': access_token_secret,
        },
      }
    )
    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    }
  } catch (error: any) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data),
      }
    } else {
      console.error('Error', error.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      }
    }
  }
}

export { handler }
