import { auth } from 'twitter-api-sdk'
import crypto from 'crypto'
import axios from 'axios'
import Twitter from 'twitter-lite'
import redis from './redis'

const client_id = process.env.TWITTER_CLIENT_ID
const client_secret = process.env.TWITTER_CLIENT_SECRET
const callback = process.env.TWITTER_CALLBACK
export const consumer_key = process.env.TWITTER_CONSUMER_KEY
export const consumer_secret = process.env.TWITTER_CONSUMER_SECRET

const authClient = new auth.OAuth2User({
  client_id,
  client_secret,
  callback,
  scopes: ['users.read', 'follows.read', 'tweet.read'],
})

const client = new Twitter({
  consumer_key,
  consumer_secret,
})

const basicAuthHeader = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`

export async function generateAuthURL() {
  const state = crypto.randomBytes(16).toString('hex')
  const code_challenge = crypto.randomBytes(32).toString('hex')
  await redis.setex(state, 600, code_challenge)
  return authClient.generateAuthURL({
    state,
    code_challenge_method: 'plain',
    code_challenge,
  })
}

export async function getAuthToken(state, code): Promise<string> {
  const code_verifier = await redis.get(state)
  if (!code_verifier) {
    throw new Error('Invalid request')
  }
  const res = await axios.post(
    'https://api.twitter.com/2/oauth2/token',
    {
      code,
      grant_type: 'authorization_code',
      code_verifier,
      client_id,
      redirect_uri: callback,
    },
    {
      headers: {
        Authorization: basicAuthHeader,
      },
    }
  )
  return res.data.access_token
}

export async function generateOAuthURL() {
  const res = await client.getRequestToken(callback)
  if (res.oauth_callback_confirmed === 'true') {
    // await redis.setex(res.oauth_token, 600, res.oauth_token_secret)
    return `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauth_token}`
  }
  throw new Error('oauth_callback_confirmed is false')
}

export async function getOAuthToken(
  oauth_token: string,
  oauth_verifier: string
): Promise<{ oauthToken: string; oauthSecret: string }> {
  const res = await client.getAccessToken({ oauth_token, oauth_verifier })
  return { oauthToken: res.oauth_token, oauthSecret: res.oauth_token_secret }
}
