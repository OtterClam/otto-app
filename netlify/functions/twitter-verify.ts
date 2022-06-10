import { Handler } from '@netlify/functions'
import { getApi } from 'libs/api'
import Twitter from 'twitter-lite'
import redis from '../libs/redis'
import { consumer_key, consumer_secret } from '../libs/twitter'

const handler: Handler = async event => {
  const chainId = Number(event.queryStringParameters?.chainId || 137)
  const part = event.headers.cookie?.split('twitter_token=') || []
  if (part.length < 2) {
    return {
      statusCode: 401,
      body: 'Missing twitter token',
    }
  }
  const access_token_key = event.headers.cookie?.split('twitter_token=')[1].split(';')[0] || ''
  const access_token_secret = (await redis.get(access_token_key)) || ''
  const client = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret,
  })
  let result: any
  let verified = false
  try {
    result = await client.get('account/verify_credentials')
  } catch (err) {
    console.error('verify credentials error', err)
    return {
      statusCode: 401,
    }
  }
  try {
    const api = getApi(chainId)
    await api.get('/giveaway/verifications/twitter', {
      headers: {
        'X-TWITTER-ACCESS-TOKEN-KEY': access_token_key,
        'X-TWITTER-ACCESS-TOKEN-SECRET': access_token_secret,
      },
    })
    verified = true
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      username: result.screen_name,
      verified,
    }),
  }
}

export { handler }
