import Twitter from 'twitter-lite'

const callback = process.env.TWITTER_CALLBACK || ''
export const consumer_key = process.env.TWITTER_CONSUMER_KEY || ''
export const consumer_secret = process.env.TWITTER_CONSUMER_SECRET || ''

const client = new Twitter({
  consumer_key,
  consumer_secret,
})

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
