import type { NextApiRequest, NextApiResponse } from 'next'
import { getApi } from 'pages/api/_libs/api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = Number(req.query.chainId || 137)
  const token = req.headers.authorization?.split(' ')[1] || ''
  const axios = getApi(chainId)
  const discordRes = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  let verified = false
  try {
    await axios.get('/giveaway/verifications/discord', {
      headers: {
        'X-DISCORD-ACCESS-TOKEN': token,
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
    ...discordRes.data,
    verified,
  })
}
