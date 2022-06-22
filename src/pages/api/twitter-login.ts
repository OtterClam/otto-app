import type { NextApiRequest, NextApiResponse } from 'next'
import { generateOAuthURL } from 'pages/api/_libs/twitter'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authUrl = await generateOAuthURL()
  res.status(302).setHeader('location', authUrl).json({})
}
