import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'pages/api/_libs/redis'
import { getOAuthToken } from 'pages/api/_libs/twitter'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { oauth_token, oauth_verifier } = req.query as { oauth_token: string; oauth_verifier: string }
  const { oauthToken, oauthSecret } = await getOAuthToken(oauth_token, oauth_verifier)
  await redis.setex(oauthToken, 600, oauthSecret)
  res
    .status(302)
    .setHeader('set-cookie', `twitter_token=${oauthToken}; Path=/; HttpOnly; Max-Age=7200; SameSite=None; Secure`)
    .setHeader('location', '/giveaway')
    .json({})
}
