import { Handler } from '@netlify/functions'
import redis from '../libs/redis'
import { getOAuthToken } from '../libs/twitter'

const handler: Handler = async (event, context) => {
  const { oauth_token, oauth_verifier } = event.queryStringParameters
  const { oauthToken, oauthSecret } = await getOAuthToken(oauth_token, oauth_verifier)
  await redis.setex(oauthToken, 600, oauthSecret)
  return {
    statusCode: 302,
    headers: {
      'set-cookie': `twitter_token=${oauthToken}; Path=/; HttpOnly; Max-Age=7200;`,
      location: `/giveaway`,
    },
  }
}

export { handler }
