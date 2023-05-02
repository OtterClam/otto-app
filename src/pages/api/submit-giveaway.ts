import console from 'console'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getApi } from 'pages/api/_libs/api'
import redis from 'pages/api/_libs/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, wallet, chainId } = req.body
  const discordToken = req.headers.authorization?.split(' ')[1] || ''
  try {
    const axios = getApi(chainId)
    const apiRes = await axios.post(
      '/giveaway/wallets',
      {
        code: code.trim(),
        wallet,
      },
      {
        headers: {
          'X-DISCORD-ACCESS-TOKEN': discordToken,
        },
      }
    )
    res.status(200).json(apiRes.data)
    return
  } catch (error: any) {
    console.error(JSON.stringify(error))
    if (error.response) {
      res.status(error.response.status).json(error.response.data)
      return
    }
    console.error('Error', error.message)
    res.status(500).json({ error: error.message })
  }
}
