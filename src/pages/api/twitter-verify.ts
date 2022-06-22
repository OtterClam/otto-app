import type { NextApiRequest, NextApiResponse } from 'next'
import { getApi } from 'pages/api/_libs/api'
import Twitter from 'twitter-lite'
import redis from 'pages/api/_libs/redis'
import { consumer_key, consumer_secret } from 'pages/api/_libs/twitter'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = Number(req.query.chainId || 137)
  const part = req.headers.cookie?.split('twitter_token=') || []
  if (part.length < 2) {
    res.status(401).send('Missing twitter token')
    return
  }

  const access_token_key = req.headers.cookie?.split('twitter_token=')[1].split(';')[0] || ''
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
    res.status(401).json({})
    return
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
  res.status(200).json({
    username: result.screen_name,
    verified,
  })
}
